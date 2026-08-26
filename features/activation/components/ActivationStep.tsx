export const ActivationStep = ({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) => (
  <div className="step fade-in-up-stagger">
    <div className="step-header">
      <div className="step-icon-wrapper">{icon}</div>
      <div className="step-number-badge">{number}</div>
    </div>
    <h3 className="step-title">{title}</h3>
    <p className="step-text">{text}</p>
  </div>
);