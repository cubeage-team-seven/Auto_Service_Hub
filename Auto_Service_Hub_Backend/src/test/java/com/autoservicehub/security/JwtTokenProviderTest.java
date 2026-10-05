package com.autoservicehub.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for {@link JwtTokenProvider} (SRS 2.4, 19).
 *
 * <p>Two behaviours are pinned: a token round-trips (generate, validate, read
 * back subject and role), and a <strong>short secret still produces a working
 * key</strong>. That second one is the regression guard for the /login 500: the
 * shipped default secret is 25 bytes, HS256 needs 32, and handing those bytes
 * straight to {@code Keys.hmacShaKeyFor} threw {@code WeakKeyException} at
 * runtime. Test J8 asserts the old behaviour really did throw, so the reason for
 * the fix cannot be quietly forgotten.
 *
 * <p>No real secret is embedded — these use obviously-fake material, as SRS 19
 * requires of committed code.
 */
class JwtTokenProviderTest {

    /** Clearly fake, and long enough not to trip the length check. */
    private static final String GOOD_SECRET =
            "test-only-not-a-real-secret-0123456789abcdef";

    private JwtTokenProvider providerWith(String secret) {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "secret", secret);
        ReflectionTestUtils.setField(provider, "accessTokenExpiryMs", 3_600_000L);
        ReflectionTestUtils.setField(provider, "refreshTokenExpiryMs", 604_800_000L);
        return provider;
    }

    @Test
    @DisplayName("J1 a generated token validates and carries the subject and role")
    void generatedTokenRoundTrips() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        String token = provider.generateAccessToken("anil", "SERVICE_ADVISOR");

        assertThat(provider.validateToken(token)).isTrue();
        assertThat(provider.getUsername(token)).isEqualTo("anil");
        assertThat(provider.getRole(token)).isEqualTo("SERVICE_ADVISOR");
    }

    @Test
    @DisplayName("J2 a ROLE_-prefixed role is normalised to the bare name")
    void rolePrefixIsNormalised() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        assertThat(provider.getRole(provider.generateAccessToken("anil", "ROLE_MANAGER")))
                .isEqualTo("MANAGER");
    }

    @Test
    @DisplayName("J3 a tampered token is rejected")
    void tamperedTokenIsRejected() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);
        String token = provider.generateAccessToken("anil", "MANAGER");

        assertThat(provider.validateToken(token.substring(0, token.length() - 2) + "xy")).isFalse();
    }

    @Test
    @DisplayName("J4 a token signed with a different secret is rejected")
    void tokenFromAnotherSecretIsRejected() {
        String token = providerWith(GOOD_SECRET).generateAccessToken("anil", "MANAGER");

        assertThat(providerWith("a-completely-different-test-secret-value-xx")
                .validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("J5 null, blank and garbage tokens are rejected rather than throwing")
    void malformedTokensAreRejected() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        assertThat(provider.validateToken(null)).isFalse();
        assertThat(provider.validateToken("")).isFalse();
        assertThat(provider.validateToken("   ")).isFalse();
        assertThat(provider.validateToken("not-a-jwt")).isFalse();
    }

    @Test
    @DisplayName("J6 an expired token is rejected")
    void expiredTokenIsRejected() {
        JwtTokenProvider issuer = new JwtTokenProvider();
        ReflectionTestUtils.setField(issuer, "secret", GOOD_SECRET);
        ReflectionTestUtils.setField(issuer, "accessTokenExpiryMs", -60_000L);   // already expired

        assertThat(providerWith(GOOD_SECRET)
                .validateToken(issuer.generateAccessToken("anil", "MANAGER"))).isFalse();
    }

    @Test
    @DisplayName("J7 a short secret still yields a usable HS256 key")
    void shortSecretStillProducesAWorkingKey() {
        // The value shipped as the default in application.yml: 25 bytes, under the
        // 32-byte minimum for HS256.
        String shortSecret = "change-this-secret-in-env";
        assertThat(shortSecret.getBytes(StandardCharsets.UTF_8).length).isLessThan(32);

        JwtTokenProvider provider = providerWith(shortSecret);
        String token = provider.generateAccessToken("anil", "MANAGER");

        // It must work rather than throw WeakKeyException at runtime.
        assertThat(provider.validateToken(token)).isTrue();
        assertThat(provider.getUsername(token)).isEqualTo("anil");
    }

    @Test
    @DisplayName("J8 the original approach really did throw, which is why the digest was added")
    void rawShortSecretWouldHaveThrown() throws Exception {
        byte[] raw = "change-this-secret-in-env".getBytes(StandardCharsets.UTF_8);

        // Passing the raw bytes straight through fails the HS256 length check…
        org.assertj.core.api.Assertions
                .assertThatThrownBy(() -> Keys.hmacShaKeyFor(raw))
                .isInstanceOf(io.jsonwebtoken.security.WeakKeyException.class);

        // …whereas digesting yields exactly the 32 bytes HS256 needs.
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw);
        assertThat(digest).hasSize(32);
        SecretKey key = Keys.hmacShaKeyFor(digest);
        assertThat(key).isNotNull();

        String token = Jwts.builder()
                .subject("anil")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusSeconds(600)))
                .signWith(key)
                .compact();
        assertThat(token.split("\\.")).hasSize(3);
    }

    // ── Token lifecycle: refresh tokens (SRS 9) ─────────────────────────────

    @Test
    @DisplayName("J9 a refresh token validates as a refresh token and carries the subject")
    void refreshTokenRoundTrips() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        String token = provider.generateRefreshToken("anil", "MANAGER");

        assertThat(provider.validateRefreshToken(token)).isTrue();
        assertThat(provider.getUsername(token)).isEqualTo("anil");
        assertThat(provider.getRole(token)).isEqualTo("MANAGER");
    }

    @Test
    @DisplayName("J10 a refresh token is NOT accepted as an access token")
    void refreshTokenIsNotAnAccessToken() {
        // This is the property that stops a long-lived refresh token being
        // presented as a bearer token against protected endpoints.
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        String refresh = provider.generateRefreshToken("anil", "MANAGER");

        assertThat(provider.validateToken(refresh)).isFalse();
    }

    @Test
    @DisplayName("J11 an access token is NOT accepted as a refresh token")
    void accessTokenIsNotARefreshToken() {
        // Otherwise /refresh would be a way to bypass an expired access token.
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        String access = provider.generateAccessToken("anil", "MANAGER");

        assertThat(provider.validateRefreshToken(access)).isFalse();
    }

    @Test
    @DisplayName("J12 a refresh token signed with another secret is rejected")
    void refreshTokenFromAnotherSecretIsRejected() {
        JwtTokenProvider issuer   = providerWith(GOOD_SECRET);
        JwtTokenProvider verifier = providerWith("a-completely-different-secret-0123456789");

        String token = issuer.generateRefreshToken("anil", "MANAGER");

        assertThat(verifier.validateRefreshToken(token)).isFalse();
    }

    @Test
    @DisplayName("J13 a tampered refresh token is rejected")
    void tamperedRefreshTokenIsRejected() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        String token = provider.generateRefreshToken("anil", "MANAGER");
        String tampered = token.substring(0, token.length() - 2) + "xy";

        assertThat(provider.validateRefreshToken(tampered)).isFalse();
    }

    @Test
    @DisplayName("J14 null, blank and junk refresh tokens are rejected")
    void malformedRefreshTokensAreRejected() {
        JwtTokenProvider provider = providerWith(GOOD_SECRET);

        assertThat(provider.validateRefreshToken(null)).isFalse();
        assertThat(provider.validateRefreshToken("")).isFalse();
        assertThat(provider.validateRefreshToken("   ")).isFalse();
        assertThat(provider.validateRefreshToken("not-a-jwt")).isFalse();
    }

    @Test
    @DisplayName("J15 an expired refresh token is rejected")
    void expiredRefreshTokenIsRejected() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "secret", GOOD_SECRET);
        // A negative lifetime puts the expiry in the past, which is the only way
        // to exercise expiry without sleeping in the test.
        ReflectionTestUtils.setField(provider, "refreshTokenExpiryMs", -1_000L);

        String token = provider.generateRefreshToken("anil", "MANAGER");

        assertThat(provider.validateRefreshToken(token)).isFalse();
    }

    @Test
    @DisplayName("J16 a refresh token outlives an access token")
    void refreshTokenLastsLonger() {
        // The whole point of the two lifetimes: a short access token forces the
        // client back through /refresh rather than holding a bearer token for long.
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "secret", GOOD_SECRET);
        ReflectionTestUtils.setField(provider, "accessTokenExpiryMs", 60_000L);
        ReflectionTestUtils.setField(provider, "refreshTokenExpiryMs", 604_800_000L);

        long accessExpiry  = expiryOf(provider.generateAccessToken("anil", "MANAGER"));
        long refreshExpiry = expiryOf(provider.generateRefreshToken("anil", "MANAGER"));

        assertThat(refreshExpiry).isGreaterThan(accessExpiry);
    }

    /** Reads the {@code exp} claim as epoch seconds. */
    private long expiryOf(String token) {
        return Jwts.parser().verifyWith(
                        io.jsonwebtoken.security.Keys.hmacShaKeyFor(sha256(GOOD_SECRET)))
                .build().parseSignedClaims(token).getPayload().getExpiration().toInstant().getEpochSecond();
    }

    private static byte[] sha256(String material) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(material.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
