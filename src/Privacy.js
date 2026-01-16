import React, { useEffect } from "react";
import "./Privacy.css";

function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-shell">
      <main className="privacy-page">
        <h1>Privacy Policy for HalaAI (Bio-Monitor)</h1>

        <div className="privacy-disclaimer">
          <strong>Project Status: Personal Use Only</strong>
          <br />
          This application is a private, personal development project ("Pet Project")
          designed solely for the use of the developer. It is not a commercial product,
          SaaS, or public application. It is not intended for use by anyone other than
          the account owner.
        </div>

        <p>Last Updated: January 15, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          HalaAI (Bio-Monitor) is a local software agent designed to retrieve,
          analyze, and visualize personal health data from the WHOOP API. This
          privacy policy explains how data is handled within this closed local
          ecosystem.
        </p>

        <h2>2. Data We Collect</h2>
        <p>
          To function as a personal health assistant, the application collects the
          following data via the WHOOP API:
        </p>
        <ul>
          <li>
            <strong>Physiological Metrics:</strong> Recovery scores, Sleep
            performance, Resting Heart Rate (RHR), Heart Rate Variability (HRV),
            and Strain data.
          </li>
          <li>
            <strong>Authentication Data:</strong> OAuth2 Access Tokens and
            Refresh Tokens required to maintain a connection to the WHOOP API.
          </li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>The data collected is used strictly for personal coaching and analysis purposes:</p>
        <ul>
          <li>
            <strong>Personalized Insights:</strong> Comparing daily metrics against
            historical baselines to identify trends.
          </li>
          <li>
            <strong>Notifications:</strong> Generating automated alerts (via local
            LLM processing) to a private Discord server regarding recovery status
            (e.g., "Take a rest day").
          </li>
          <li>
            <strong>Trend Analysis:</strong> Storing historical data to visualize
            long-term health improvements.
          </li>
        </ul>

        <h2>4. Data Storage and Security</h2>
        <p>
          All data retrieved from WHOOP is stored locally on a private, physical
          machine (Mac Studio) located at the developer's residence.
        </p>
        <ul>
          <li>
            <strong>Database:</strong> Metrics are stored in a local PostgreSQL
            database (`hala_ai_history`).
          </li>
          <li>
            <strong>No Cloud Storage:</strong> Data is not uploaded to any
            third-party cloud servers, analytics providers, or external data
            aggregators.
          </li>
          <li>
            <strong>Token Security:</strong> API tokens are stored locally in
            secured environment variables or encrypted database fields.
          </li>
        </ul>

        <h2>5. Data Sharing</h2>
        <p>
          <strong>We do not share your data with anyone.</strong>
        </p>
        <p>
          Since this is a single-user project, no data is sold, rented, or shared
          with third parties, advertisers, or other organizations. The data
          travels solely from WHOOP's servers to the developer's local machine.
        </p>

        <h2>6. Data Retention and Deletion</h2>
        <p>Data is retained indefinitely for the purpose of long-term trend analysis.</p>
        <p>
          <strong>Deletion Process:</strong> As the sole user and administrator,
          the developer retains full control to wipe the local database or revoke
          WHOOP API access at any time via the WHOOP mobile app or by deleting the
          local database files.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          For any questions regarding this policy or the data handling practices of
          this project, please contact the developer:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:stablevegeta@gmail.com">stablevegeta@gmail.com</a>
        </p>

        <div className="privacy-footer">
          &copy; 2026 HalaAI Personal Project. All rights reserved.
        </div>
      </main>
    </div>
  );
}

export default Privacy;
