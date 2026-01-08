import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Customize your learning experience.</p>
          <div className="card-elevated">
            <AccessibilityPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
}
