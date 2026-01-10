import React from "react";
import { FaHeadset, FaShieldAlt, FaShippingFast, FaUndo } from "react-icons/fa";
import "./ServiceFeatures.css";

const features = [
  {
    icon: <FaShippingFast />,
    title: "Free Shipping",
    desc: "Orders over 500k",
    color: "#3B82F6", // Blue
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Payment",
    desc: "100% Protected",
    color: "#10B981", // Green
  },
  {
    icon: <FaUndo />,
    title: "Easy Returns",
    desc: "30 Days Policy",
    color: "#F59E0B", // Amber
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Dedicated Support",
    color: "#8B5CF6", // Violet
  }
];

export default function ServiceFeatures() {
  return (
    <div className="service-features">
      {features.map((feature, index) => (
        <div key={index} className="feature-item">
          <div className="feature-icon" style={{ color: feature.color, backgroundColor: `${feature.color}15` }}>
            {feature.icon}
          </div>
          <div className="feature-info">
            <h4 className="feature-title">{feature.title}</h4>
            <p className="feature-desc">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
