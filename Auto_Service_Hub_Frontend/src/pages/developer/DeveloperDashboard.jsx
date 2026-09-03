import React from "react";

function DeveloperDashboard() {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          borderBottom: "1px solid #333",
          paddingBottom: "20px",
          marginBottom: "30px"
        }}
      >

        <p
          style={{
            color: "#aaa",
            marginBottom: "8px"
          }}
        >
          Auto_Service_Hub / Developer
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "32px"
          }}
        >
          Developer Dashboard
        </h1>

        <p
          style={{
            color: "#999"
          }}
        >
          QA Engineer Workspace
        </p>

      </div>


      {/* MODULES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px"
        }}
      >


        {/* APIs */}

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "25px",
            background: "#151515"
          }}
        >

          <h2>API Management</h2>

          <p style={{ color: "#aaa" }}>
            Manage and test application APIs,
            endpoints and integrations.
          </p>

          <button>
            Open APIs
          </button>

        </div>


        {/* DATABASE */}

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "25px",
            background: "#151515"
          }}
        >

          <h2>Database</h2>

          <p style={{ color: "#aaa" }}>
            Monitor database structure,
            tables and connections.
          </p>

          <button>
            Open Database
          </button>

        </div>


        {/* SECURITY */}

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "25px",
            background: "#151515"
          }}
        >

          <h2>Security</h2>

          <p style={{ color: "#aaa" }}>
            Manage authentication,
            authorization and security checks.
          </p>

          <button>
            Open Security
          </button>

        </div>


        {/* VALIDATION */}

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "25px",
            background: "#151515"
          }}
        >

          <h2>Validation</h2>

          <p style={{ color: "#aaa" }}>
            Validate application inputs,
            APIs and business rules.
          </p>

          <button>
            Open Validation
          </button>

        </div>


        {/* TEST CASES */}

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "25px",
            background: "#151515"
          }}
        >

          <h2>Test Cases</h2>

          <p style={{ color: "#aaa" }}>
            Create, execute and track
            QA test cases.
          </p>

          <button>
            Open Test Cases
          </button>

        </div>


        {/* ACCEPTANCE */}

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "25px",
            background: "#151515"
          }}
        >

          <h2>Acceptance</h2>

          <p style={{ color: "#aaa" }}>
            Review acceptance criteria,
            testing results and releases.
          </p>

          <button>
            Open Acceptance
          </button>

        </div>


      </div>

    </div>

  );
}

export default DeveloperDashboard;