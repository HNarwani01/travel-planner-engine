import React from 'react';
import { BudgetBreakdown as BudgetBreakdownType } from '../../types';

interface BudgetBreakdownProps {
  budget: BudgetBreakdownType;
}

export default function BudgetBreakdown({ budget }: BudgetBreakdownProps) {
  return (
    <div className="card mt-4">
      <h3 className="mb-4">Budget Breakdown</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div className="text-secondary text-sm">Accommodation</div>
          <div className="font-medium">{budget.accommodation}</div>
        </div>
        <div>
          <div className="text-secondary text-sm">Food</div>
          <div className="font-medium">{budget.food}</div>
        </div>
        <div>
          <div className="text-secondary text-sm">Activities</div>
          <div className="font-medium">{budget.activities}</div>
        </div>
        <div>
          <div className="text-secondary text-sm">Transport</div>
          <div className="font-medium">{budget.transport}</div>
        </div>
      </div>
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-bold">Total Estimated</span>
        <span className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--accent-color)' }}>{budget.total}</span>
      </div>
    </div>
  );
}
