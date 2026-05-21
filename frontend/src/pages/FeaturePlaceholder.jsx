import React from 'react';

const FeaturePlaceholder = ({ title, description }) => {
  return (
    <section className="panel">
      <h1>{title}</h1>
      <p>{description}</p>
      <p className="muted">This module is now routed correctly and can be implemented incrementally.</p>
    </section>
  );
};

export default FeaturePlaceholder;
