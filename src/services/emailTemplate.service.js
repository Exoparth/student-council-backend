function emailTemplate({ title, message, statusColor = "#6366f1", buttonText, buttonLink }) {
  return `
  <div style="
    margin:0;
    padding:0;
    background:#0f1117;
    font-family:Inter, Arial, sans-serif;
  ">
    
    <div style="
      max-width:600px;
      margin:40px auto;
      background:#131929;
      border-radius:16px;
      border:1px solid rgba(255,255,255,0.08);
      padding:32px;
      color:#e2e8f0;
    ">

      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="
          font-family:Syne, Arial;
          font-size:26px;
          font-weight:800;
          margin:0;
          background:linear-gradient(135deg,#a5b4fc,#c4b5fd);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        ">
          Council Portal
        </h1>

        <p style="
          margin-top:6px;
          color:#64748b;
          font-size:13px;
        ">
          Student Council Application System
        </p>
      </div>

      <div style="
        background:rgba(255,255,255,0.03);
        border-radius:12px;
        padding:24px;
        border:1px solid rgba(255,255,255,0.06);
      ">
      
        <h2 style="
          margin-top:0;
          color:${statusColor};
          font-size:20px;
        ">
          ${title}
        </h2>

        <p style="
          font-size:14px;
          line-height:1.6;
          color:#cbd5e1;
        ">
          ${message}
        </p>

        ${
          buttonLink
            ? `
        <div style="margin-top:24px;text-align:center;">
          <a href="${buttonLink}" style="
            display:inline-block;
            padding:12px 24px;
            border-radius:8px;
            background:linear-gradient(135deg,#6366f1,#8b5cf6);
            color:white;
            text-decoration:none;
            font-weight:600;
            font-size:14px;
          ">
            ${buttonText}
          </a>
        </div>`
            : ""
        }

      </div>

      <div style="
        text-align:center;
        margin-top:24px;
        font-size:12px;
        color:#475569;
      ">
        © ${new Date().getFullYear()} Student Council Portal
      </div>

    </div>
  </div>
  `;
}

module.exports = emailTemplate;