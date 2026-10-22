import React, { useState, useEffect, useCallback } from 'react';
import type { ActiveTab } from './types';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { EvaluationPage } from './pages/EvaluationPage';
import { AboutPage } from './pages/AboutPage';
import { PresentationStepper } from './components/presentation/PresentationStepper';
import type { PresentationStepDef } from './data/presentationSteps';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [presentationStepIndex, setPresentationStepIndex] = useState<number>(0);
  const [activePresetExampleId, setActivePresetExampleId] = useState<string | undefined>();

  // Toggle presentation mode
  const handleTogglePresentation = useCallback(() => {
    setIsPresentationMode((prev) => !prev);
  }, []);

  // Exit presentation mode cleanly without losing state
  const handleExitPresentation = useCallback(() => {
    setIsPresentationMode(false);
  }, []);

  // Execute demonstration step
  const handleExecuteDemoAction = useCallback((step: PresentationStepDef) => {
    setActiveTab(step.targetTab);
    if (step.exampleId) {
      setActivePresetExampleId(step.exampleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Global presentation mode keyboard shortcuts:
  // [P] = Toggle presentation mode (when not typing in an input or textarea)
  // [Escape] = Exit presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'p' || e.key === 'P') {
        if (!isInputFocused && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handleTogglePresentation();
        }
      } else if (e.key === 'Escape' && isPresentationMode) {
        handleExitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePresentation, handleExitPresentation, isPresentationMode]);

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        // Clear preset override if user manually selects another tab
        if (tab !== 'analyze') {
          setActivePresetExampleId(undefined);
        }
      }}
      isPresentationMode={isPresentationMode}
      onTogglePresentationMode={handleTogglePresentation}
      presentationStepper={
        <PresentationStepper
          currentStepIndex={presentationStepIndex}
          onStepChange={setPresentationStepIndex}
          onExitPresentation={handleExitPresentation}
          onExecuteDemoAction={handleExecuteDemoAction}
        />
      }
    >
      {activeTab === 'overview' && (
        <OverviewPage
          onNavigateToAnalyze={() => setActiveTab('analyze')}
          onNavigateToEvaluation={() => setActiveTab('evaluation')}
          onNavigateToAbout={() => setActiveTab('about')}
        />
      )}

      {activeTab === 'analyze' && (
        <AnalyzePage presetExampleId={activePresetExampleId} />
      )}

      {activeTab === 'evaluation' && (
        <EvaluationPage />
      )}

      {activeTab === 'about' && <AboutPage />}
    </AppShell>
  );
};

export default App;
