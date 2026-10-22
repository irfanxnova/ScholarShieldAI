import React from 'react';
import { AnalysisWorkspace } from '../components/analysis/AnalysisWorkspace';

interface AnalyzePageProps {
  presetExampleId?: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ presetExampleId }) => {
  return (
    <div>
      <AnalysisWorkspace presetExampleId={presetExampleId} />
    </div>
  );
};
