'use client';

import React, { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { TripRequest } from '../../types';
import { useTrip } from '../../hooks/useTrip';
import { INTERESTS, CONSTRAINTS, BUDGETS } from '../../constants';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import ItineraryCard from '../../components/plan/ItineraryCard';
import MapView from '../../components/plan/MapView';
import BudgetBreakdown from '../../components/plan/BudgetBreakdown';

export default function PlanPage() {
  const { tripPlan, loading, error, swappingActivity, planTrip, swapActivity } = useTrip();

  const [formData, setFormData] = useState<TripRequest>({
    destination: '',
    duration: 3,
    budget: 'Mid-range',
    interests: [],
    constraints: []
  });

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleConstraintChange = (constraint: string) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.includes(constraint)
        ? prev.constraints.filter(c => c !== constraint)
        : [...prev.constraints, constraint]
    }));
  };

  const handlePlanTrip = () => planTrip(formData, false);
  const handleRegenerate = () => planTrip(formData, true);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Travel Planning & Experience Engine</h1>
        <p className="text-secondary mt-4">AI-powered personalized itineraries for your next adventure.</p>
      </header>

      {error && (
        <div className="error-message flex items-center gap-2" role="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!tripPlan && !loading && (
        <Card style={{ maxWidth: '600px', margin: '0 auto', width: '100%', backgroundColor: 'var(--card-bg)' }}>
          <div className="form-group">
            <label htmlFor="destination" className="form-label">Destination</label>
            <Input 
              id="destination"
              type="text" 
              placeholder="e.g. Kyoto, Japan" 
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
              required
              style={{ backgroundColor: 'white', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div className="flex gap-4 mb-6">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label htmlFor="duration" className="form-label">Duration (Days)</label>
              <Input 
                id="duration"
                type="number" 
                min="1" 
                max="14" 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                required
                style={{ backgroundColor: 'white', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              />
            </div>
            
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label htmlFor="budget" className="form-label">Budget Level</label>
              <select 
                id="budget"
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
              >
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interests</label>
            <div className="checkbox-group">
              {INTERESTS.map(interest => (
                <label key={interest} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Constraints</label>
            <div className="checkbox-group">
              {CONSTRAINTS.map(constraint => (
                <label key={constraint} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.constraints.includes(constraint)}
                    onChange={() => handleConstraintChange(constraint)}
                  />
                  {constraint}
                </label>
              ))}
            </div>
          </div>

          <Button 
            fullWidth 
            onClick={handlePlanTrip}
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? <LoadingSpinner /> : 'Plan My Trip'}
          </Button>
        </Card>
      )}

      {loading && !tripPlan && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size={40} color="var(--accent-color)" />
          <h2 className="text-secondary mt-4">Planning your trip to {formData.destination}...</h2>
        </div>
      )}

      {tripPlan && (
        <div className="main-content">
          <div className="left-panel">
            <div className="flex justify-between items-center mb-6">
              <h2>Your {formData.duration}-Day Itinerary</h2>
              <button 
                className="btn-outline" 
                onClick={handleRegenerate}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                Regenerate
              </button>
            </div>

            <div className="itinerary-list">
              {tripPlan.days.map((day, dIdx) => (
                <ItineraryCard 
                  key={day.day}
                  day={day}
                  swappingActivity={swappingActivity}
                  onSwap={(activity) => swapActivity(formData.destination, dIdx, day.day, activity)}
                />
              ))}
            </div>

            {tripPlan.budgetBreakdown && (
              <BudgetBreakdown budget={tripPlan.budgetBreakdown} />
            )}
          </div>

          <div className="right-panel">
            <div className="map-container">
              <MapView days={tripPlan.days} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
