import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileCheck, GraduationCap, TrendingUp, GitCompare } from 'lucide-react';
import { Button } from './components/ui/button';
import { TemplateData, ReportData, FormData, ViewType, NotificationData, FormSection, UserRole, AIWorkflowStep, AuditLogEntry, TrainingRecord } from './types';
import { defaultFormData, initialReportsData } from './constants';
import { LoginHeader } from './components/LoginHeader';
import { LoginFooter } from './components/LoginFooter';
import { SignInPage } from './components/SignInPage';
import { Dashboard } from './components/Dashboard';
import { FormPages } from './components/FormPages';
import { LeftSidebar } from './components/LeftSidebar';
import { UploadTemplates } from './components/UploadTemplates';
import { RaiseRequest } from './components/RaiseRequest';
import { Reports } from './components/Reports';
import { DocumentLibrary } from './components/DocumentLibrary';
import { PreparatorDocumentLibrary } from './components/PreparatorDocumentLibrary';
import { ReviewerDocumentLibrary } from './components/ReviewerDocumentLibrary';
import { ApproverDocumentLibrary } from './components/ApproverDocumentLibrary';
import { DocumentPublishing } from './components/DocumentPublishing';
import { DocumentManagement } from './components/DocumentManagement';
import { TrainingManagement } from './components/TrainingManagement';
import { DocumentEffectiveness } from './components/DocumentEffectiveness';
import { DocumentVersioning } from './components/DocumentVersioning';
import { Workflows } from './components/Workflows';
import { ConfigureWorkflow } from './components/ConfigureWorkflow';
import { UserManagement } from './components/UserManagement';
import { Breadcrumbs } from './components/Breadcrumbs';
import { DepartmentsView } from './components/DepartmentsView';
import { EnterpriseSettings } from './components/EnterpriseSettings';
import { NotificationSettings } from './components/NotificationSettings';
import { NotificationsPage } from './components/NotificationsPage';
import { NotificationsHub } from './components/NotificationsHub';
import { Chat } from './components/Chat';
import { DynamicFormViewer } from './components/DynamicFormViewer';
import { AIConversionPreview } from './components/AIConversionPreview';
import { WorkflowApprovalStep } from './components/WorkflowApprovalStep';
import { AnalyticsReports } from './components/AnalyticsReports';
import { AuditLogs } from './components/AuditLogs';
import { WorkflowConfiguration } from './components/WorkflowConfiguration';
import { ReviewApprovalInterface } from './components/ReviewApprovalInterface';
import { HomePage } from './components/HomePage';
import { TicketFlow } from './components/TicketFlow';
import { TicketFlowLogin } from './components/TicketFlowLogin';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHomeDashboard } from './components/AdminHomeDashboard';
import { RolePermissionsManagement } from './components/RolePermissionsManagement';
import { DepartmentSetupManagement } from './components/DepartmentSetupManagement';
import { SOPConfiguration } from './components/SOPConfiguration';
import { WorkflowRulesSetup } from './components/WorkflowRulesSetup';
import { ReportsAnalyticsDashboard } from './components/ReportsAnalyticsDashboard';
import { PreparatorDashboard } from './components/PreparatorDashboard';
import { ActivityLogTable } from './components/ActivityLogTable';
import { ActivityLogDetail } from './components/ActivityLogDetail';
import { RemarksInbox } from './components/RemarksInbox';
import { DocumentEditScreen } from './components/DocumentEditScreen';
import { DocumentPreviewScreen } from './components/DocumentPreviewScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { parseExcelToFormSections, extractDepartmentFromFilename, formSectionsToFormData } from './utils/excelParser';
import { parseWordToFormSections } from './utils/wordParser';
import { parsePdfToFormSections } from './utils/pdfParser';
import { generateWorkflowFromSections } from './utils/workflowGenerator';
import { generateElectronicSignature, requiresSignature } from './utils/signatureGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { CheckCircle, Clock, FileSignature } from 'lucide-react';

import { SubmissionAssignmentModal } from './components/SubmissionAssignmentModal';

export default function App() {
  const [showHomePage, setShowHomePage] = useState(true);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [pendingSubmissionData, setPendingSubmissionData] = useState<{ id: string; title: string } | null>(null);
  const [showTicketFlowLogin, setShowTicketFlowLogin] = useState(false);
  const [ticketFlowLoginModule, setTicketFlowLoginModule] = useState<'ticketflow' | 'dms' | 'qms'>('ticketflow');
  const [isTicketFlowSignedIn, setIsTicketFlowSignedIn] = useState(false);
  const [ticketFlowUser, setTicketFlowUser] = useState({ username: '', password: '' });
  const [intendedModule, setIntendedModule] = useState<'dms' | 'ticket-flow' | null>(null);
  const [previousView, setPreviousView] = useState<ViewType | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginData, setLoginData] = useState({ 
    username: '', 
    password: '', 
    rememberMe: false,
    role: 'admin' as UserRole
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedWorkflowForConfig, setSelectedWorkflowForConfig] = useState<any>(null);
  const [workflowCustomSteps, setWorkflowCustomSteps] = useState<Record<string, any[]>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRequestIdForAudit, setSelectedRequestIdForAudit] = useState<string | null>(null);
  const [selectedActivityLogRequestId, setSelectedActivityLogRequestId] = useState<string | null>(null);
  const [selectedReportForReview, setSelectedReportForReview] = useState<ReportData | null>(null);
  const [selectedReportForPreview, setSelectedReportForPreview] = useState<ReportData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Track if form is in edit mode
  const [approvedWorkflows, setApprovedWorkflows] = useState<Array<{
    id: string;
    fileName: string;
    department: string;
    uploadDate: string;
    workflow: any[];
    approvedDate: string;
  }>>([]);
  const [pendingConversion, setPendingConversion] = useState<{
    sections: FormSection[];
    fileName: string;
    department: string;
    fileSize: string;
    uploadDate: string;
  } | null>(null);
  const [pendingWorkflow, setPendingWorkflow] = useState<{
    workflow: any[];
    sections: FormSection[];
    fileName: string;
    department: string;
    fileSize: string;
    uploadDate: string;
    fileType: string;
  } | null>(null);
  
  // Current user data (mock - in production this would come from auth)
  const currentUser = {
    id: '1',
    name: loginData.username || 'Admin User',
    email: 'admin@company.com',
    role: 'Admin',
    isAdmin: true,
    department: 'Engineering'
  };
  
  // Ensure currentFormData is never undefined by providing a fallback
  const [currentFormData, setCurrentFormData] = useState<FormData>(() => {
    return defaultFormData || {
      // Fallback in case defaultFormData is undefined
      isPart: false,
      isMaterial: false,
      materialCode: '',
      partMaterial: '',
      supplierCode: '',
      supplierName: '',
      shippedCargoType: '',
      isPrelaunch: false,
      isPrototype: false,
      site: '',
      dateSentToFactory: '',
      billOfLadingNo: '',
      quantity: '',
      reasonMaterialChange: false,
      reasonApprovalExpiry: false,
      reasonNewSupplier: false,
      reasonChangeDesign: false,
      reasonNewPart: false,
      reasonProcessChange: false,
      productTechnicalCode: '',
      productName: '',
      productStage: '',
      isMassProduction: false,
      isProductDevelopment: false,
      dataSheetNo: '',
      drawingNo: '',
      manufacturerSelectionNumber: '',
      requesterName: '',
      requesterPosition: '',
      requesterDateSignature: '',
      approverName: '',
      approverPosition: '',
      approverDateSignature: '',
      requestAcceptable: false,
      notAcceptable: false,
      notAcceptableDueTo: '',
      qaName1: '',
      qaPosition1: '',
      qaDateSignature1: '',
      noTestReport: false,
      noECR: false,
      qaName2: '',
      qaPosition2: '',
      qaDateSignature2: '',
      noSample: false,
      noPrototype: false,
      dimensionalOK: false,
      dimensionalNOK: false,
      dimensionalEvidence: '',
      materialOK: false,
      materialNOK: false,
      materialEvidence: '',
      durabilityOK: false,
      durabilityNOK: false,
      durabilityEvidence: '',
      performanceOK: false,
      performanceNOK: false,
      performanceEvidence: '',
      assemblyOK: false,
      assemblyNOK: false,
      assemblyEvidence: '',
      documentsOK: false,
      documentsNOK: false,
      documentsEvidence: '',
      samplesOK: false,
      samplesNOK: false,
      samplesEvidence: '',
      betterThan: false,
      worseThan: false,
      sameAs: false,
      noParallel: false,
      comparisonEvidence: '',
      expertName1: '',
      expertPosition1: '',
      expertDateSignature1: '',
      managerName1: '',
      managerPosition1: '',
      managerDateSignature1: '',
      isGeneral: true,
      isExclusive: false,
      documentCode: '',
      durabilityOKP4: false,
      durabilityNOKP4: false,
      durabilityEvidenceP4: '',
      performanceOKP4: false,
      performanceNOKP4: false,
      performanceEvidenceP4: '',
      assemblyOKP4: false,
      assemblyNOKP4: false,
      assemblyEvidenceP4: '',
      documentsOKP4: false,
      documentsNOKP4: false,
      documentsEvidenceP4: '',
      samplesOKP4: false,
      samplesNOKP4: false,
      samplesEvidenceP4: '',
      betterThanP4: false,
      worseThanP4: false,
      sameAsP4: false,
      noParallelP4: false,
      comparisonEvidenceP4: '',
      expertName2: '',
      expertPosition2: '',
      expertDateSignature2: '',
      managerName2: '',
      managerPosition2: '',
      managerDateSignature2: '',
      qaExpertName: '',
      qaExpertPosition: '',
      qaExpertDateSignature: '',
      qaManagerName: '',
      qaManagerPosition: '',
      qaManagerDateSignature: '',
      isApproved: false,
      isConditionallyApproved: false,
      isApprovedLimited: false,
      isRejected: false,
      approvalDescription: '',
      approvalUntilDate: '',
      deputyName: '',
      deputyPosition: '',
      deputyDateSignature: '',
      prelaunchNeeded: false,
      prelaunchNotNeeded: false,
      auditNeeded: false,
      auditNotNeeded: false,
      archiveDate: '',
      evidence: '',
      actions: '',
      finalName: '',
      finalPosition: '',
      finalDateSignature: '',
      isGeneralP6: true,
      isExclusiveP6: false,
      documentCodeP6: ''
    };
  });
  
  // Separate templates (uploaded files) and reports (submitted forms)
  const [templates, setTemplates] = useState<TemplateData[]>([
    // Sample templates
    {
      id: 'sample-template-1',
      fileName: 'Engineering_Approval_Form.xlsx',
      uploadDate: '2024-01-15',
      fileSize: '0.5 MB',
      department: 'engineering',
      status: 'pending',
      parsedSections: [
        {
          id: 'section_1',
          title: 'Part Information',
          fields: [
            { id: 'field_part_name', label: 'Part Name', type: 'text', value: '', required: true },
            { id: 'field_part_number', label: 'Part Number', type: 'text', value: '', required: true },
            { id: 'field_manufacturer', label: 'Manufacturer', type: 'text', value: '', required: true },
            { id: 'field_supplier', label: 'Supplier', type: 'text', value: '', required: false },
            { id: 'field_description', label: 'Description', type: 'textarea', value: '', required: true }
          ]
        }
      ]
    }
  ]);
  const [reports, setReports] = useState<ReportData[]>(initialReportsData || []);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notification system state
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: 'sample_1',
      title: 'Welcome to the System',
      message: 'Your document management system is now ready to use.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'request_submitted',
      isRead: false
    }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Audit Logs system state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Training Management system state
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setCurrentFormData(prev => {
      if (!prev) return currentFormData;
      return { ...prev, [field]: value };
    });
  };

  const saveFormData = () => {
    if (currentDocumentId && currentFormData) {
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === currentDocumentId 
            ? { 
                ...report, 
                formData: currentFormData,
                lastModified: new Date().toISOString()
              }
            : report
        )
      );
    }
  };

  const loadFormData = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report && report.formData) {
      setCurrentFormData(report.formData);
    } else {
      setCurrentFormData(defaultFormData || currentFormData);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      setIsSignedIn(true);
      if (intendedModule === 'ticket-flow') {
        setCurrentView('ticket-flow');
      } else if (loginData.role.toLowerCase().includes('approver')) {
        setCurrentView('document-library');
      } else if (loginData.role === 'admin') {
        setCurrentView('admin-home');
      } else {
        setCurrentView('dashboard');
      }
      setIntendedModule(null);
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setLoginData({ username: '', password: '', rememberMe: false, role: 'admin' });
    setCurrentView('dashboard');
    setShowHomePage(false); // Navigate directly to login page
    setIntendedModule(null);
  };

  const handleTicketFlowLogin = (username: string, password: string) => {
    if (username && password) {
      if (ticketFlowLoginModule === 'dms') {
        let role: UserRole = 'admin';
        if (username.includes('preparator')) role = 'preparator';
        else if (username.includes('reviewer')) {
          const match = username.match(/reviewer\s*(\d+)/i);
          role = match ? `Reviewer ${match[1]}` as UserRole : 'Reviewer 1';
        }
        else if (username.includes('approver')) {
          const match = username.match(/approver\s*(\d+)/i);
          role = match ? `Approver ${match[1]}` as UserRole : 'approver';
        }
        else if (username.includes('manager')) {
          if (username === 'robert.manager') role = 'manager_reviewer';
          else role = 'manager';
        }
        
        setLoginData({ username, password, rememberMe: false, role });
        setIsSignedIn(true);
        if (role === 'admin') setCurrentView('admin-home');
        else if (role === 'manager') setCurrentView('document-management');
        else setCurrentView('dashboard');
      } else {
        setTicketFlowUser({ username, password });
        setIsTicketFlowSignedIn(true);
      }
      setShowTicketFlowLogin(false);
    }
  };

  const handleTicketFlowSignOut = () => {
    setIsTicketFlowSignedIn(false);
    setTicketFlowUser({ username: '', password: '' });
    setShowHomePage(true);
  };

  const handleViewChange = (view: ViewType) => {
    setPreviousView(currentView);
    setCurrentView(view);
    if (view === 'approval-form' || view === 'dynamic-form') {
      setCurrentPage(1);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const fileType = file.name.split('.').pop()?.toLowerCase() || '';
      
      toast.info(`Analyzing ${file.name}...`, {
        description: 'AI is processing the document structure and generating a workflow.',
      });
      
      try {
        let parsedSections: FormSection[] = [];
        if (fileType === 'xlsx' || fileType === 'xls') {
          parsedSections = await parseExcelToFormSections(file);
        } else if (fileType === 'doc' || fileType === 'docx') {
          parsedSections = await parseWordToFormSections(file);
        } else if (fileType === 'pdf') {
          parsedSections = await parsePdfToFormSections(file);
        }
        
        // Fix: Arguments were in wrong order. Definition: (fileName, sections, fileType)
        const workflowResult = generateWorkflowFromSections(file.name, parsedSections, fileType);
        
        const fileSizeBytes = file.size;
        const fileSizeFormatted = `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`;
        const uploadDateFormatted = new Date().toISOString().split('T')[0];

        if (currentView === 'document-management') {
          // Admin/Manager flow: Skip workflow approval and go straight to conversion preview
          setPendingConversion({
            sections: parsedSections,
            fileName: file.name,
            department: workflowResult.primaryDepartment,
            fileSize: fileSizeFormatted,
            uploadDate: uploadDateFormatted
          });
          setCurrentView('ai-conversion-preview');
          
          toast.success('AI Analysis Complete!', {
            description: `Document "${file.name}" analyzed. Showing conversion preview.`
          });
        } else {
          // Standard flow: Show workflow approval first
          setPendingWorkflow({
            workflow: workflowResult.steps || workflowResult.workflow, // Handle different property names if any
            sections: parsedSections,
            fileName: file.name,
            department: workflowResult.primaryDepartment,
            fileSize: fileSizeFormatted,
            uploadDate: uploadDateFormatted,
            fileType
          });
          
          setCurrentView('workflow-approval');
          
          toast.success('AI Analysis Complete!', {
            description: `Document "${file.name}" analyzed. Please review the generated workflow.`
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('File Processing Error');
      }
    }
  };

  const handleWorkflowApprove = () => {
    if (pendingWorkflow) {
      const approvedWorkflow = {
        id: `workflow_${Date.now()}`,
        fileName: pendingWorkflow.fileName,
        department: pendingWorkflow.department,
        uploadDate: pendingWorkflow.uploadDate,
        workflow: pendingWorkflow.workflow,
        approvedDate: new Date().toISOString().split('T')[0]
      };
      setApprovedWorkflows(prev => [approvedWorkflow, ...prev]);
      
      setPendingConversion({
        sections: pendingWorkflow.sections,
        fileName: pendingWorkflow.fileName,
        department: pendingWorkflow.department,
        fileSize: pendingWorkflow.fileSize,
        uploadDate: pendingWorkflow.uploadDate
      });
      
      setPendingWorkflow(null);
      setCurrentView('ai-conversion-preview');
    }
  };

  const handleWorkflowReject = () => {
    setPendingWorkflow(null);
    setSelectedFiles(null);
    setCurrentView('upload-templates');
  };

  const handleConversionSave = (updatedSections: FormSection[], updatedFileName?: string, updatedDepartment?: string) => {
    if (pendingConversion) {
      const convertedFormData = formSectionsToFormData(updatedSections);
      const uniqueId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newTemplate: TemplateData = {
        id: uniqueId,
        fileName: updatedFileName || pendingConversion.fileName,
        uploadDate: pendingConversion.uploadDate,
        fileSize: pendingConversion.fileSize,
        department: updatedDepartment || pendingConversion.department,
        status: 'pending',
        parsedSections: updatedSections,
        convertedFormData
      };
      
      setTemplates([...templates, newTemplate]);
      setPendingConversion(null);
      setSelectedFiles(null);
      
      addAuditLog(
        'document_uploaded',
        'document',
        newTemplate.id,
        newTemplate.fileName,
        `Document uploaded and converted.`,
        newTemplate.department
      );
      
      toast.success('Template Saved Successfully!');
      
      // Return to the appropriate view based on role
      if (loginData.role === 'admin' || loginData.role === 'manager' || loginData.role === 'preparator') {
        setCurrentView('document-management');
      } else {
        setCurrentView('upload-templates');
      }
    }
  };

  const handleConversionCancel = () => {
    setPendingConversion(null);
    setSelectedFiles(null);
    
    // Return to the appropriate view based on role
    if (loginData.role === 'admin' || loginData.role === 'manager' || loginData.role === 'preparator') {
      setCurrentView('document-management');
    } else {
      setCurrentView('upload-templates');
    }
  };

  const handleClearSelection = () => {
    setSelectedFiles(null);
  };

  const handleViewForm = (requestIdOrReportId: string) => {
    let report = reports.find(r => r.requestId === requestIdOrReportId) || reports.find(r => r.id === requestIdOrReportId);
    if (report) {
      setCurrentDocumentId(report.id);
      setIsEditMode(false);
      const template = templates.find(t => t.fileName === report.fileName);
      loadFormData(report.id);
      if (template?.parsedSections?.length) setCurrentView('dynamic-form');
      else {
        setCurrentView('form');
        setCurrentPage(1);
      }
    }
  };

  const handleEditForm = (requestIdOrReportId: string) => {
    const report = reports.find(r => r.requestId === requestIdOrReportId) || reports.find(r => r.id === requestIdOrReportId);
    if (report) {
      setCurrentDocumentId(report.id);
      setIsEditMode(true);
      const template = templates.find(t => t.fileName === report.fileName);
      loadFormData(report.id);
      
      // Use the advanced DocumentEditScreen for all edits
      if (template?.parsedSections?.length) {
        setCurrentView('dynamic-form');
      } else {
        // Fallback or specific handling for fixed form in the same advanced viewer
        setCurrentView('document-edit-screen-fixed');
      }
    }
  };

  const handleFormSelection = (templateId: string) => {
    setCurrentDocumentId(templateId);
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate?.parsedSections?.length) setCurrentView('dynamic-form');
    else {
      setCurrentFormData(defaultFormData || currentFormData);
      setCurrentView('approval-form');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId));
    toast.success('Report Deleted');
  };

  const handlePreviewDocument = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReportForPreview(report);
      setCurrentView('document-preview');
    }
  };

  const handleDownloadDocument = (reportId: string, fileName: string) => {
    toast.info('Download Started', { description: `Downloading ${fileName}...` });
  };

  const handlePublishDocument = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setReports(prev => prev.map(r => r.id === reportId ? { 
        ...r, 
        status: 'published',
        publishedDate: new Date().toISOString(),
        publishedBy: loginData.username
      } : r));
      toast.success('Document Published');
      
      // After publish document should moved into document effectiveness module
      setTimeout(() => {
        setCurrentView('document-effectiveness');
      }, 1000);
    }
  };

  const updateReportStatus = (reportId: string, newStatus: ReportData['status']) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
  };

  const createNewReport = (templateId: string, assignment?: { reviewerIds: string[]; priority: string; comments: string }) => {
    const template = templates.find(t => t.id === templateId);
    if (template && currentFormData) {
      const newId = (Math.max(...reports.map(r => parseInt(r.id) || 0), 0) + 1).toString();
      const newReqNum = Math.max(...reports.map(r => {
        const match = r.requestId?.match(/REQ(\d+)/);
        return match ? parseInt(match[1]) : 0;
      }), 0) + 1;
      
      const newReport: ReportData = {
        id: newId,
        requestId: `REQ${newReqNum.toString().padStart(3, '0')}`,
        fileName: template.fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        assignedTo: assignment ? assignment.reviewerIds[0] : 'Current User',
        status: assignment ? 'submitted' : 'pending',
        lastModified: new Date().toISOString(),
        fileSize: template.fileSize,
        department: template.department,
        formData: { ...currentFormData },
        documentType: 'Request',
        fromUser: loginData.username,
        reviewSequence: assignment?.reviewerIds,
        currentReviewerIndex: assignment ? 0 : undefined,
        priority: assignment?.priority,
        submissionComments: assignment?.comments
      };
      setReports(prev => [newReport, ...prev]);
      return newId;
    }
    return null;
  };

  const handleSave = () => {
    saveFormData();
    toast.success('Form Saved');
    
    // For Preparator in AI Conversion (dynamic-form), navigate back to AI Conversion page (document-management)
    if (loginData.role === 'preparator' && currentView === 'dynamic-form') {
      setCurrentView('document-management');
    }
  };

  const handleSubmit = () => {
    saveFormData();
    
    // Find document details for the modal
    let docTitle = "Request Document";
    if (currentDocumentId) {
      const report = reports.find(r => r.id === currentDocumentId);
      const template = templates.find(t => report ? t.fileName === report.fileName : t.id === currentDocumentId);
      docTitle = template?.fileName || report?.fileName || "Request Document";
    }

    if (currentDocumentId) {
      setPendingSubmissionData({ id: currentDocumentId, title: docTitle });
      setIsSubmissionModalOpen(true);
    }
  };

  const handleFinalSubmit = (assignment: { reviewerIds: string[]; priority: string; comments: string; action?: string }) => {
    if (!pendingSubmissionData) return;
    
    const { id } = pendingSubmissionData;
    const { action } = assignment;

    // Handle Reviewer specialized actions
    if (action && action !== 'submit') {
      const statusMap: Record<string, ReportData['status']> = {
        'reviewed': (loginData.role === 'approver' || loginData.role === 'manager_approver') ? 'approved' : 'reviewed',
        'revision': 'needs-revision',
        'rejected': 'rejected'
      };
      
      const newStatus = statusMap[action];
      if (newStatus) {
        updateReportStatus(id, newStatus);
        
        // Log activity
        const actionLabel = action === 'reviewed' 
          ? ((loginData.role === 'approver' || loginData.role === 'manager_approver') ? 'Approved' : 'Reviewed')
          : action === 'revision' ? 'Sent for Revision' : 'Rejected';
          
        toast.success(`Request ${actionLabel} successfully`);
        
        setIsSubmissionModalOpen(false);
        setCurrentView('document-library');
        return;
      }
    }

    // Check if we are submitting a new request from a template or an existing report (draft)
    const reportIndex = reports.findIndex(r => r.id === id);
    const isNewRequest = reportIndex === -1;

    if (currentView === 'approval-form' || isNewRequest) {
      createNewReport(id, assignment);
      toast.success('Workflow Initiated', {
        description: `Submitted to ${assignment.reviewerIds.length} reviewers in sequence.`
      });
      setCurrentView('document-library');
    } else {
      // Update existing report
      const updatedReport: ReportData = {
        ...reports[reportIndex],
        status: 'submitted',
        reviewSequence: assignment.reviewerIds,
        currentReviewerIndex: 0,
        assignedTo: assignment.reviewerIds[0],
        priority: assignment.priority,
        submissionComments: assignment.comments,
        lastModified: new Date().toISOString()
      };
      
      // Remove from current position and prepend to move it to the first row
      setReports(prev => [updatedReport, ...prev.filter(r => r.id !== id)]);
      
      toast.success('Workflow Initiated', {
        description: `Sequential review started with ${assignment.reviewerIds.length} members.`
      });
      
      if (currentView === 'form') {
        setCurrentPage(2);
      } else {
        setCurrentView('document-library');
      }
    }
    
    setIsSubmissionModalOpen(false);
    setPendingSubmissionData(null);
  };

  const handleApprove = () => {
    saveFormData();
    if (currentDocumentId) {
      if (currentPage < 6) {
        setCurrentPage(currentPage + 1);
        toast.success(`Page ${currentPage} Approved`);
      } else {
        updateReportStatus(currentDocumentId, 'approved');
        toast.success('Final Registration Completed');
        setCurrentView('document-library');
      }
    }
  };

  const handleCancel = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    else setCurrentView('dashboard');
  };

  const handleReset = () => {
    setCurrentFormData(defaultFormData || currentFormData);
    toast.info('Form Reset');
  };

  const handleReject = () => {
    if (currentDocumentId) {
      updateReportStatus(currentDocumentId, 'rejected');
      toast.error('Document Rejected');
    }
    setCurrentView('document-library');
  };

  const handleNeedRevisions = () => {
    if (currentDocumentId) {
      setReports(prev => prev.map(r => r.id === currentDocumentId ? { ...r, status: 'needs-revision' } : r));
      toast.warning('Revisions Requested');
    }
    setCurrentView('document-library');
  };

  const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => {
    setNotifications(prev => [{ ...notification, id: `notif_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false }, ...prev]);
  };

  const handleNotificationToggle = () => setIsNotificationOpen(!isNotificationOpen);
  const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const handleDeleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const handleSaveWorkflowConfig = (id: string, steps: any[]) => {
    setWorkflowCustomSteps(prev => ({ ...prev, [id]: steps }));
  };

  const addAuditLog = (action: AuditLogEntry['action'], entityType: AuditLogEntry['entityType'], entityId: string, entityName: string, details: string, department?: string) => {
    setAuditLogs(prev => [{
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action, entityType, entityId, entityName, user: loginData.username, userRole: loginData.role, department, details, ipAddress: '127.0.0.1'
    }, ...prev]);
  };

  const handleAuditLogsRefresh = () => {
    toast.success('Audit logs refreshed');
  };

  const handleAuditLogsExport = () => {
    toast.success('Audit logs exported successfully');
  };

  const handleDynamicFormSubmit = (data: any) => {
    console.log('Dynamic form submitted:', data);
    if (currentDocumentId) {
      const template = templates.find(t => t.id === currentDocumentId);
      if (template) {
        createNewReport(currentDocumentId);
        toast.success('Request Submitted Successfully!');
        setCurrentView('raise-request');
      } else {
        const report = reports.find(r => r.id === currentDocumentId);
        if (report) {
          updateReportStatus(currentDocumentId, 'submitted');
          toast.success('Changes Submitted Successfully!');
          setCurrentView('document-library');
        }
      }
    }
  };

  const renderDashboard = () => {
    let dashboardReports = reports;
    if (loginData.role === 'manager_reviewer') {
      dashboardReports = reports.filter(r => !['unknown', 'pending', 'review-process', 'review process'].includes((r.status || '').toLowerCase()));
    }
    
    return (
      <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
        {loginData.role === 'preparator' ? (
          <PreparatorDashboard onNavigate={handleViewChange} reports={dashboardReports} />
        ) : (
          <Dashboard onNavigate={handleViewChange} reports={dashboardReports} templates={templates} />
        )}
      </div>
    );
  };

  const renderUploadTemplates = () => renderDocumentManagement();

  const renderRaiseRequest = () => (
    <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
      <RaiseRequest
        templates={templates}
        onFormSelect={handleFormSelection}
        onNavigate={handleViewChange}
      />
    </div>
  );

  const renderReports = () => {
    let reportsData = reports;
    if (loginData.role === 'manager_reviewer') {
      reportsData = reports.filter(r => !['unknown', 'pending', 'review-process', 'review process'].includes((r.status || '').toLowerCase()));
    }
    
    return (
      <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
        <Reports
          reports={reportsData}
          onViewForm={handleViewForm}
          onNavigate={handleViewChange}
          filterStatus={filterStatus}
          searchTerm={searchTerm}
          onFilterStatusChange={setFilterStatus}
          onSearchTermChange={setSearchTerm}
          onPreviewDocument={handlePreviewDocument}
          onDeleteReport={handleDeleteReport}
          onDownloadDocument={handleDownloadDocument}
        />
      </div>
    );
  };

  const renderDocumentLibrary = () => {
    let libraryReports = reports;
    if (loginData.role === 'manager_reviewer') {
      libraryReports = reports.filter(r => !['unknown', 'pending', 'review-process', 'review process'].includes((r.status || '').toLowerCase()));
    }

    return (
      <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
        {loginData.role === 'admin' || loginData.role === 'preparator' ? (
          <PreparatorDocumentLibrary
            reports={libraryReports}
            onViewForm={handleViewForm}
            onPreviewDocument={handlePreviewDocument}
            onDeleteReport={handleDeleteReport}
            onDownloadDocument={handleDownloadDocument}
            onNavigate={handleViewChange}
            onPublishDocument={handlePublishDocument}
            userRole={loginData.role}
            currentUsername={loginData.username}
          />
        ) : loginData.role === 'manager_reviewer' ? (
          <ReviewerDocumentLibrary
            reports={libraryReports}
            onViewForm={handleViewForm}
            onPreviewDocument={handlePreviewDocument}
            onDownloadDocument={handleDownloadDocument}
            onNavigate={handleViewChange}
            currentUsername={loginData.username}
          />
        ) : (
          <DocumentLibrary
            reports={libraryReports}
            templates={templates}
            onViewForm={handleViewForm}
            onPreviewDocument={handlePreviewDocument}
            onDeleteReport={handleDeleteReport}
            onDownloadDocument={handleDownloadDocument}
            onNavigate={handleViewChange}
            onPublishDocument={handlePublishDocument}
            userRole={loginData.role}
            currentUsername={loginData.username}
          />
        )}
      </div>
    );
  };

  const renderFormView = () => (
    <FormPages
      currentPage={currentPage}
      formData={currentFormData}
      onFormDataChange={updateFormData}
      onSave={handleSave}
      onReset={handleReset}
      onSubmit={handleSubmit}
      onApprove={handleApprove}
      onCancel={handleCancel}
      isViewOnly={!isEditMode && loginData.role !== 'preparator'}
      userRole={loginData.role}
    />
  );

  const renderApprovalForm = () => (
    <FormPages
      currentPage={1}
      formData={currentFormData}
      onFormDataChange={updateFormData}
      onSave={handleSave}
      onReset={handleReset}
      onSubmit={handleSubmit}
      onApprove={handleApprove}
      onCancel={handleCancel}
      isViewOnly={false}
      userRole={loginData.role}
    />
  );

  const renderDocumentManagement = () => (
    <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
      <DocumentManagement
        templates={templates}
        reports={reports}
        onNavigate={handleViewChange}
        selectedFiles={selectedFiles}
        onFileUpload={handleFileUpload}
        onUploadSubmit={handleUploadSubmit}
        onClearSelection={handleClearSelection}
      />
    </div>
  );

  const renderWorkflows = () => (
    <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full text-blue-800">
      <Workflows
        reports={reports}
        templates={templates}
        onNavigate={handleViewChange}
        onConfigureWorkflow={setSelectedWorkflowForConfig}
        workflowCustomSteps={workflowCustomSteps}
        approvedWorkflows={approvedWorkflows}
      />
    </div>
  );

  const renderConfigureWorkflow = () => (
    <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
      <ConfigureWorkflow
        workflow={selectedWorkflowForConfig}
        onNavigate={handleViewChange}
        onSaveWorkflow={handleSaveWorkflowConfig}
      />
    </div>
  );

  const renderUserManagement = () => (
    <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 min-h-full">
      <UserManagement onNavigate={handleViewChange} />
    </div>
  );

  const renderAIConversionPreview = () => {
    if (!pendingConversion) {
      setCurrentView('upload-templates');
      return null;
    }
    return (
      <div className="bg-slate-50 min-h-full">
        <AIConversionPreview
          sections={pendingConversion.sections}
          fileName={pendingConversion.fileName}
          department={pendingConversion.department}
          fileSize={pendingConversion.fileSize}
          uploadDate={pendingConversion.uploadDate}
          onSave={handleConversionSave}
          onCancel={handleConversionCancel}
        />
      </div>
    );
  };

  const renderWorkflowApproval = () => {
    if (!pendingWorkflow) return null;
    return (
      <WorkflowApprovalStep
        fileName={pendingWorkflow.fileName}
        department={pendingWorkflow.department}
        fileSize={pendingWorkflow.fileSize}
        uploadDate={pendingWorkflow.uploadDate}
        workflow={pendingWorkflow.workflow}
        fileType={pendingWorkflow.fileType}
        sections={pendingWorkflow.sections}
        onApprove={handleWorkflowApprove}
        onReject={handleWorkflowReject}
      />
    );
  };

  if (showHomePage) {
    return (
      <HomePage 
        onNavigateToDMS={() => { 
          setShowHomePage(false); 
          setIntendedModule('dms'); 
          setShowTicketFlowLogin(false);
        }}
        onNavigateToLogin={() => { 
          setShowHomePage(false); 
          setShowTicketFlowLogin(false);
        }}
        onNavigateToTicketFlow={() => { 
          setShowHomePage(false); 
          setIntendedModule('ticket-flow');
          setTicketFlowLoginModule('ticketflow');
          setShowTicketFlowLogin(true);
        }}
      />
    );
  }

  if (showTicketFlowLogin) {
    return (
      <TicketFlowLogin 
        onLogin={handleTicketFlowLogin}
        onBackToHome={() => {
          setShowTicketFlowLogin(false);
          setShowHomePage(true);
        }}
        moduleType={ticketFlowLoginModule}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <SignInPage 
        loginData={loginData}
        onLoginDataChange={(data) => setLoginData({ ...loginData, ...data })}
        onSignIn={handleSignIn}
        onBackToHome={() => setShowHomePage(true)}
      />
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="flex-shrink-0">
        {loginData.role === 'admin' ? (
          <AdminSidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            userRole={loginData.role}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
          />
        ) : (
          <LeftSidebar
            isCollapsed={isSidebarCollapsed}
            currentView={currentView}
            onViewChange={handleViewChange}
            onToggleCollapse={handleSidebarToggle}
            onChatToggle={handleChatToggle}
            userRole={loginData.role}
          />
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex-shrink-0">
          <LoginHeader 
            onSignOut={handleSignOut} 
            notifications={notifications}
            isNotificationOpen={isNotificationOpen}
            onNotificationToggle={handleNotificationToggle}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            currentView={currentView}
            currentPage={currentPage}
            currentDocumentId={currentDocumentId}
            onNavigate={handleViewChange}
            onViewForm={handleViewForm}
            isChatOpen={isChatOpen}
            onChatToggle={handleChatToggle}
            isSidebarCollapsed={isSidebarCollapsed}
            userRole={loginData.role}
            username={loginData.username}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          {currentView === 'dashboard' && <div className="flex-1 overflow-y-auto">{renderDashboard()}</div>}
          {currentView === 'upload-templates' && <div className="flex-1 overflow-y-auto">{renderUploadTemplates()}</div>}
          {currentView === 'raise-request' && <div className="flex-1 overflow-y-auto">{renderRaiseRequest()}</div>}
          {currentView === 'reports' && <div className="flex-1 overflow-y-auto">{renderReports()}</div>}
          {currentView === 'document-library' && <div className="flex-1 overflow-y-auto">{renderDocumentLibrary()}</div>}
          {currentView === 'activity-log' && (
            <div className="bg-gray-50 flex-1 overflow-y-auto p-6">
              <ActivityLogTable 
                onViewDetail={(id) => { setSelectedActivityLogRequestId(id); setCurrentView('activity-log-detail'); }}
                reports={reports}
              />
            </div>
          )}
          {currentView === 'activity-log-detail' && (
            <div className="bg-gray-50 flex-1 overflow-y-auto p-6">
              <ActivityLogDetail 
                requestId={selectedActivityLogRequestId || ''}
                onBack={() => { 
                  if (previousView === 'dynamic-form' || previousView === 'approval-form') {
                    setCurrentView(previousView);
                  } else {
                    setSelectedActivityLogRequestId(null); 
                    setCurrentView('activity-log'); 
                  }
                }}
                reports={reports}
              />
            </div>
          )}
          {currentView === 'remarks-inbox' && (
            <div className="bg-gray-50 flex-1 overflow-y-auto p-6">
              <RemarksInbox 
                onViewForm={handleViewForm}
                onEditForm={handleEditForm}
                reports={reports}
                currentUsername={loginData.username}
                userRole={loginData.role}
              />
            </div>
          )}
          {currentView === 'form' && <div className="flex-1 overflow-y-auto">{renderFormView()}</div>}
          {currentView === 'approval-form' && <div className="flex-1 overflow-y-auto">{renderApprovalForm()}</div>}
          {currentView === 'document-management' && <div className="flex-1 overflow-y-auto">{renderDocumentManagement()}</div>}
          {currentView === 'training-management' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto">
              <TrainingManagement trainingRecords={trainingRecords} publishedDocuments={reports.filter(r => r.status === 'published')} />
            </div>
          )}
          {currentView === 'document-effectiveness' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto">
              <DocumentEffectiveness 
                reports={reports} 
                userRole={loginData.role}
                onViewDocument={(id) => {
                  setCurrentDocumentId(id);
                  setCurrentView('dynamic-form');
                }}
                onEditDocument={(id) => {
                  handleEditForm(id);
                }}
              />
            </div>
          )}
          {currentView === 'document-versioning' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto">
              <DocumentVersioning />
            </div>
          )}
          {currentView === 'workflows' && <div className="flex-1 overflow-y-auto">{renderWorkflows()}</div>}
          {currentView === 'configure-workflow' && <div className="flex-1 overflow-y-auto">{renderConfigureWorkflow()}</div>}
          {currentView === 'user-management' && <div className="flex-1 overflow-y-auto">{renderUserManagement()}</div>}
          {currentView === 'departments' && <div className="flex-1 overflow-y-auto"><DepartmentsView /></div>}
          {currentView === 'enterprise' && <div className="flex-1 overflow-y-auto"><EnterpriseSettings onNavigate={handleViewChange} /></div>}
          {currentView === 'admin-home' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <AdminHomeDashboard onNavigate={handleViewChange} />
            </div>
          )}
          {currentView === 'role-permissions' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <RolePermissionsManagement />
            </div>
          )}
          {currentView === 'department-setup' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <DepartmentSetupManagement />
            </div>
          )}
          {currentView === 'workflow-rules' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <WorkflowRulesSetup />
            </div>
          )}
          {currentView === 'reports-analytics' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <ReportsAnalyticsDashboard />
            </div>
          )}
          {currentView === 'notifications' && (
            <div className="flex-1 overflow-y-auto">
              <NotificationsHub
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDeleteNotification={handleDeleteNotification}
                currentUser={currentUser}
              />
            </div>
          )}
          {currentView === 'notification-settings' && <div className="flex-1 overflow-y-auto"><NotificationSettings currentUser={currentUser} /></div>}
          {currentView === 'chat' && <div className="flex-1 overflow-y-auto"><Chat onNavigate={handleViewChange} /></div>}
          {currentView === 'audit-logs' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <AuditLogs
                auditLogs={auditLogs}
                reports={reports}
                onRefresh={handleAuditLogsRefresh}
                onExport={handleAuditLogsExport}
                filterRequestId={selectedRequestIdForAudit}
                onViewActivityDetail={(requestId) => {
                  setSelectedActivityLogRequestId(requestId);
                  setCurrentView('activity-log-detail');
                }}
              />
            </div>
          )}
          {currentView === 'workflow-configuration' && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <WorkflowConfiguration />
            </div>
          )}
          {currentView === 'review-approval' && selectedReportForReview && (
            <div className="bg-gradient-to-br from-pale-blue-50 via-pale-blue-100 to-pale-blue-200 flex-1 overflow-y-auto p-6">
              <ReviewApprovalInterface
                document={selectedReportForReview}
                currentUser={{ email: currentUser.username, name: currentUser.fullName || currentUser.username, role: currentUser.role }}
                onApprove={() => handleViewChange('document-library')}
                onReject={() => handleViewChange('document-library')}
                onRequestChanges={() => handleViewChange('document-library')}
                onDelegate={() => handleViewChange('document-library')}
                onClose={() => handleViewChange('document-library')}
              />
            </div>
          )}
          {currentView === 'document-publishing' && (
            <div className="flex-1 overflow-y-auto">
              <DocumentPublishing reports={reports} onViewForm={handleViewForm} onPublishDocument={handlePublishDocument} />
            </div>
          )}
          {currentView === 'dynamic-form' && currentDocumentId && (() => {
            const report = reports.find(r => r.id === currentDocumentId);
            const template = templates.find(t => report ? t.fileName === report.fileName : t.id === currentDocumentId);
            if (template && template.parsedSections) {
              return (
                <div className="flex-1 h-full overflow-hidden">
                  <DocumentEditScreen
                    documentTitle={template.fileName || 'AI Generated Form'}
                    requestId={report?.requestId || 'NEW-REQ'}
                    department={template.department || 'Engineering'}
                    status={report?.status || 'pending'}
                    userRole={loginData.role}
                    username={loginData.username}
                    onBack={() => setCurrentView(loginData.role === 'preparator' ? 'document-library' : 'raise-request')}
                    onSave={handleSave}
                    onSubmit={handleSubmit}
                    onReset={() => {}}
                    onViewActivity={() => {
                      const report = reports.find(r => r.id === currentDocumentId || r.requestId === currentDocumentId);
                      setSelectedActivityLogRequestId(report?.requestId || report?.id || currentDocumentId || '');
                      handleViewChange('activity-log-detail');
                    }}
                    isDynamicForm={true}
                    sections={template.parsedSections}
                    onDynamicSave={handleDynamicFormSubmit}
                    initialData={report?.formData || currentFormData}
                  />
                </div>
              );
            }
            return <div className="p-8 text-center text-slate-600 flex-1">Template not found</div>;
          })()}
          {currentView === 'document-edit-screen-fixed' && currentDocumentId && (() => {
            const report = reports.find(r => r.id === currentDocumentId);
            return (
              <div className="flex-1 h-full overflow-hidden">
                <DocumentEditScreen
                  documentTitle={report?.fileName || 'Standard Form'}
                  requestId={report?.requestId || 'NEW-REQ'}
                  department={report?.department || 'Operations'}
                  status={report?.status || 'pending'}
                  userRole={loginData.role}
                  username={loginData.username}
                  onBack={() => setCurrentView('document-library')}
                  onSave={handleSave}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                  onViewActivity={() => {
                    const report = reports.find(r => r.id === currentDocumentId || r.requestId === currentDocumentId);
                    setSelectedActivityLogRequestId(report?.requestId || report?.id || currentDocumentId || '');
                    handleViewChange('activity-log-detail');
                  }}
                  isFixedForm={true}
                  currentFormData={currentFormData}
                  updateFormData={updateFormData}
                />
              </div>
            );
          })()}
          {currentView === 'document-preview' && selectedReportForPreview && (
            <div className="flex-1 overflow-y-auto">
              <DocumentPreviewScreen 
                document={selectedReportForPreview}
                onBack={() => { setSelectedReportForPreview(null); setCurrentView('document-library'); }}
                onDownload={() => handleDownloadDocument(selectedReportForPreview.id, selectedReportForPreview.fileName)}
              />
            </div>
          )}
          {currentView === 'ai-conversion-preview' && <div className="flex-1 overflow-y-auto">{renderAIConversionPreview()}</div>}
          {currentView === 'workflow-approval' && <div className="flex-1 overflow-y-auto">{renderWorkflowApproval()}</div>}
        </div>
      </div>
      
      <SubmissionAssignmentModal 
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onConfirm={handleFinalSubmit}
        documentTitle={pendingSubmissionData?.title || "Request Document"}
        userRole={loginData.role}
      />
      
      <Toaster />
    </div>
  );
}