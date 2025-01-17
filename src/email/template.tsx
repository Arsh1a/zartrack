import * as React from "react";

interface EmailTemplateProps {
  email: string;
  code: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  code,
}) => (
  <div>
    <h1>Welcome, {email}!</h1>
    <p>
      Your OTP code: <strong style={{ fontSize: "32px" }}>{code}</strong>
    </p>
  </div>
);
