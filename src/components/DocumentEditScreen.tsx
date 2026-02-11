import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Clock,
  Shield,
  FileCheck,
  Send,
  Save,
  RotateCcw,
  MessageSquare,
  History
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ReportData, FormData, ViewType, FormSection } from '../types';
import { getStatusColor, getStatusLabel } from '../utils/statusUtils';
import { FormPages } from './FormPages';
import { DynamicFormViewer } from './DynamicFormViewer';
import { DocumentSmartScroll } from './DocumentSmartScroll';
import { PageRemarksModal } from './PageRemarksModal';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentEditScreenProps {
  documentTitle: string;
  requestId: string;
  department: string;
  status: string;
  userRole?: string;
  onBack: () => void;
  onSave: () => void;
  onSubmit: () => void;
  onReset: () => void;
  onViewActivity?: () => void;
  
  // For FormPages (Fixed 6-page form)
  isFixedForm?: boolean;
  currentFormData?: FormData;
  updateFormData?: (field: keyof FormData, value: any) => void;
  username?: string;
  
  // For DynamicForm (Converted from Template)
  isDynamicForm?: boolean;
  sections?: FormSection[];
  onDynamicSave?: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

export const DocumentEditScreen: React.FC<DocumentEditScreenProps> = ({
  documentTitle,
  requestId,
  department,
  status,
  userRole,
  onBack,
  onSave,
  onSubmit,
  onReset,
  onViewActivity,
  isFixedForm,
  currentFormData,
  updateFormData,
  username,
  isDynamicForm,
  sections,
  onDynamicSave,
  initialData
}) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSmartScrollCollapsed, setIsSmartScrollCollapsed] = useState(false);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  const [activeRemarkPage, setActiveRemarkPage] = useState<number | null>(null);
  const [pageRemarks, setPageRemarks] = useState<Record<number, string>>({});
  
  const totalPages = isFixedForm ? 6 : (sections?.length || 1);

  // Map sections for Smart Navigator
  const navigatorSections: FormSection[] = isFixedForm 
    ? Array.from({ length: 6 }, (_, i) => ({
        id: `page_${i + 1}`,
        title: `Page ${i + 1}: ${i === 0 ? 'Basic Info' : i === 1 ? 'Technical Data' : i === 2 ? 'Quality Specs' : i === 3 ? 'Tests' : i === 4 ? 'Reviews' : 'Approval'}`,
        fields: []
      }))
    : (sections || []);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handlePrint = () => window.print();

  // Scroll to top when page changes
  useEffect(() => {
    const mainContent = document.getElementById('edit-screen-main');
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleOpenRemarks = (e: React.MouseEvent, pageIdx: number) => {
    e.stopPropagation();
    setActiveRemarkPage(pageIdx + 1);
    setIsRemarksModalOpen(true);
  };

  const handleSaveRemark = (remark: string) => {
    if (activeRemarkPage !== null) {
      setPageRemarks(prev => ({
        ...prev,
        [activeRemarkPage]: remark
      }));
    }
  };

  const isReviewerRole = (userRole || '').toLowerCase().includes('reviewer') || 
                         (userRole || '').toLowerCase().includes('approver') ||
                         username === 'robert.manager';

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Remarks Modal */}
      <PageRemarksModal 
        isOpen={isRemarksModalOpen}
        onClose={() => setIsRemarksModalOpen(false)}
        onSave={handleSaveRemark}
        pageNumber={activeRemarkPage || 0}
        existingRemark={activeRemarkPage ? pageRemarks[activeRemarkPage] : ""}
      />
      
      {/* Top Toolbar */}
      <div className="h-16 border-b border-slate-200 bg-white backdrop-blur sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-2 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-md text-slate-900">
                {documentTitle}
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                {requestId} • {department}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewActivity}
            className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold hidden md:flex gap-2 mr-2"
          >
            <History className="h-4 w-4" />
            View Activity
          </Button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-4 hidden md:flex border border-slate-200">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono w-12 text-center text-slate-600 font-bold">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {!isReviewerRole && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset}
                className="border-none shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold hidden sm:flex gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-slate-300"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSave}
                className="border-none shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold hidden sm:flex gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-200"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            </>
          )}
          
          <Button 
            size="sm" 
            onClick={onSubmit}
            className={`border-none shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold gap-2 ${
              isReviewerRole
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-300 px-8'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-300'
            }`}
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Smart Navigator - Integrated into main screen area with transition */}
        <div 
          className={`h-full border-r border-slate-200 bg-white transition-all duration-500 overflow-hidden relative ${isSmartScrollCollapsed ? 'w-16' : 'w-80'}`}
        >
          <div className="h-full w-80">
            <DocumentSmartScroll
              sections={navigatorSections}
              activeSectionIndex={currentPage - 1}
              onSectionSelect={(idx) => setCurrentPage(idx + 1)}
              formValues={isFixedForm ? (currentFormData as any || {}) : (initialData || {})}
              isCollapsed={isSmartScrollCollapsed}
              onOpenRemarks={handleOpenRemarks}
              pageRemarks={pageRemarks}
            />
          </div>
          
          {/* Collapse Toggle Handle */}
          <button 
            onClick={() => setIsSmartScrollCollapsed(!isSmartScrollCollapsed)}
            className="absolute top-1/2 -right-3 -translate-y-1/2 z-50 w-7 h-7 bg-blue-600 border border-blue-400 rounded-full flex items-center justify-center shadow-xl hover:bg-blue-500 text-white transition-all active:scale-95"
          >
            {isSmartScrollCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        {/* Main Editor Area - Shifting right as navigator expands */}
        <main 
          id="edit-screen-main"
          className="flex-1 overflow-y-auto bg-slate-200 p-12 flex flex-col items-center document-editor-scrollbar"
        >
          {/* Page Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentPage}
            className="bg-white text-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-300 origin-top mb-20 relative rounded-sm overflow-visible"
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              transform: `scale(${zoom / 100})`,
              marginBottom: `${(zoom / 100) * 40}px`
            }}
          >
            {/* Formal Page Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            
            <div className="p-16 flex flex-col min-h-[297mm]">
               {/* Page Header (Visual only) */}
               <div className="border-b-2 border-slate-100 pb-8 mb-10 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Request for Approval</div>
                    <div className="text-sm font-black text-blue-600 uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                      Official Submission
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Section Control</div>
                    <div className="text-sm font-black text-slate-900">
                      PART {currentPage} OF {totalPages}
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 editor-canvas">
                  {isFixedForm && currentFormData && updateFormData && (
                    <FormPages 
                      currentPage={currentPage}
                      formData={currentFormData}
                      onFormDataChange={updateFormData}
                      onSave={() => {}}
                      onReset={() => {}}
                      onSubmit={() => {}}
                      onCancel={() => {}}
                      onApprove={() => {}}
                      userRole={userRole}
                      setCurrentPage={setCurrentPage}
                    />
                  )}

                  {isDynamicForm && sections && (
                    <DynamicFormViewer 
                      sections={sections}
                      fileName={documentTitle}
                      department={department}
                      initialData={initialData}
                      onSave={onDynamicSave}
                      externalPage={currentPage}
                      hideShell={true}
                    />
                  )}
                </div>

                {/* Footer (Visual only) */}
                <div className="mt-16 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
                    <div>
                      SYSTEM REF: DMS-{requestId}
                    </div>
                    <div className="text-center px-4 py-1 rounded-full text-slate-400 bg-slate-50 border border-slate-100 italic">
                      All entries are saved automatically as you type
                    </div>
                    <div>
                      PAGE {currentPage}
                    </div>
                  </div>
                </div>
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* Styles for the editor to make it look like "Paper" */}
      <style>{`
        .editor-canvas input, .editor-canvas textarea, .editor-canvas select {
          border: 1px solid #e2e8f0 !important;
          background-color: #f8fafc !important;
          color: #0f172a !important;
          border-radius: 4px !important;
          padding: 8px 12px !important;
          font-family: inherit !important;
          transition: all 0.2s ease !important;
        }
        .editor-canvas input:focus, .editor-canvas textarea:focus, .editor-canvas select:focus {
          border-color: #3b82f6 !important;
          background-color: #fff !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .editor-canvas label {
          color: #64748b !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 6px !important;
          display: block !important;
        }
        /* Hide existing form buttons as we have them in the top toolbar */
        .editor-canvas .mt-6.flex.justify-center.space-x-4 {
          display: none !important;
        }

        /* Document Editor Scrollbar */
        .document-editor-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .document-editor-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        .document-editor-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
          border: 3px solid #e2e8f0;
        }
        .document-editor-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
        .document-editor-scrollbar {
          scrollbar-width: auto;
          scrollbar-color: #3b82f6 #e2e8f0;
        }
      `}</style>
    </div>
  );
};