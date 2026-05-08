"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/shared/page-header";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { IssueTimeline } from "@/components/issues/issue-timeline";
import { IssueMessageThread } from "@/components/issues/issue-message-thread";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronRight,
  FileText,
  ImagePlus,
  Loader2,
  Phone,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Upload,
  User,
  X,
} from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { formatDateTime, formatXAF } from "@/lib/format";
import {
  URGENCY_LABELS,
  CATEGORY_LABELS,
  ISSUE_STATUS_LABELS,
  type IssueStatus,
} from "@/lib/constants";

const nextStatusMap: Record<
  string,
  { label: string; status: IssueStatus; roles: string[] }
> = {
  new: {
    label: "Mark as Reviewed",
    status: "admin_reviewed",
    roles: ["admin"],
  },
  admin_reviewed: {
    label: "Notify Landlord",
    status: "landlord_notified",
    roles: ["admin"],
  },
  landlord_notified: {
    label: "Start Repair",
    status: "repair_in_progress",
    roles: ["admin", "landlord"],
  },
  repair_in_progress: {
    label: "Mark Resolved",
    status: "resolved",
    roles: ["admin"],
  },
  resolved: {
    label: "Close Issue",
    status: "closed",
    roles: ["admin", "tenant"],
  },
};

export default function IssueDetailPage() {
  const params = useParams();
  const issueId = params.issueId as Id<"issues">;
  const { profile } = useCurrentUser();
  const issue = useQuery(api.issues.getById, { issueId });
  const updateStatus = useMutation(api.issues.updateStatus);
  const addNotes = useMutation(api.issues.addAdminNotes);
  const uploadQuoteMutation = useMutation(api.issues.uploadQuote);
  const respondToQuoteMutation = useMutation(api.issues.respondToQuote);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Quote form state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteFiles, setQuoteFiles] = useState<
    { file: File; preview: string }[]
  >([]);
  const [uploadingQuote, setUploadingQuote] = useState(false);
  const quoteFileInputRef = useRef<HTMLInputElement>(null);

  // Quote response state
  const [rejectionNote, setRejectionNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [respondingQuote, setRespondingQuote] = useState(false);

  if (issue === undefined) return <LoadingSpinner />;

  const nextAction = nextStatusMap[issue.status];
  const canAdvance =
    nextAction && profile && nextAction.roles.includes(profile.role);

  const handleStatusUpdate = async () => {
    if (!nextAction) return;
    setUpdating(true);
    try {
      await updateStatus({
        issueId,
        status: nextAction.status,
        note: statusNote || undefined,
      });
      setStatusNote("");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await addNotes({
        issueId,
        notes: adminNotes || issue.adminNotes || "",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleQuoteFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setQuoteFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    if (quoteFileInputRef.current) quoteFileInputRef.current.value = "";
  };

  const removeQuoteFile = (index: number) => {
    setQuoteFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadQuote = async () => {
    if (!quoteAmount || !quoteDescription) return;
    setUploadingQuote(true);
    try {
      let fileIds: Id<"_storage">[] | undefined;
      if (quoteFiles.length > 0) {
        fileIds = [];
        for (const qf of quoteFiles) {
          const uploadUrl = await generateUploadUrl();
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": qf.file.type },
            body: qf.file,
          });
          const { storageId } = await result.json();
          fileIds.push(storageId);
        }
      }
      await uploadQuoteMutation({
        issueId,
        amount: parseFloat(quoteAmount),
        description: quoteDescription,
        fileIds,
      });
      setShowQuoteForm(false);
      setQuoteAmount("");
      setQuoteDescription("");
      setQuoteFiles([]);
    } finally {
      setUploadingQuote(false);
    }
  };

  const handleApproveQuote = async () => {
    setRespondingQuote(true);
    try {
      await respondToQuoteMutation({ issueId, approved: true });
    } finally {
      setRespondingQuote(false);
    }
  };

  const handleRejectQuote = async () => {
    setRespondingQuote(true);
    try {
      await respondToQuoteMutation({
        issueId,
        approved: false,
        rejectionNote: rejectionNote || undefined,
      });
      setShowRejectForm(false);
      setRejectionNote("");
    } finally {
      setRespondingQuote(false);
    }
  };

  const urgencyColors: Record<string, string> = {
    low: "text-blue-600",
    medium: "text-amber-600",
    high: "text-orange-600",
    critical: "text-red-600 font-bold",
  };

  const hasQuote = issue.quoteStatus !== undefined;
  const isAdmin = profile?.role === "admin";
  const isLandlord = profile?.role === "landlord";

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={issue.title}
        description={`${issue.propertyName} - Unit ${issue.unitNumber}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Issue Details</CardTitle>
                <IssueStatusBadge status={issue.status as IssueStatus} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{issue.description}</p>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span>
                    {
                      CATEGORY_LABELS[
                        issue.category as keyof typeof CATEGORY_LABELS
                      ]
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-4 w-4 ${urgencyColors[issue.urgency]}`}
                  />
                  <span className="text-muted-foreground">Urgency:</span>
                  <span className={urgencyColors[issue.urgency]}>
                    {
                      URGENCY_LABELS[
                        issue.urgency as keyof typeof URGENCY_LABELS
                      ]
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reported by:</span>
                  <span>{issue.reporterName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span>{formatDateTime(issue._creationTime)}</span>
                </div>
                {issue.reporterPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{issue.reporterPhone}</span>
                  </div>
                )}
                {issue.assigneeName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Landlord:</span>
                    <span>{issue.assigneeName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quote Section */}
          {(hasQuote || isAdmin) && (
            <QuoteCard
              issue={issue}
              isAdmin={isAdmin}
              isLandlord={isLandlord}
              showQuoteForm={showQuoteForm}
              setShowQuoteForm={setShowQuoteForm}
              quoteAmount={quoteAmount}
              setQuoteAmount={setQuoteAmount}
              quoteDescription={quoteDescription}
              setQuoteDescription={setQuoteDescription}
              quoteFiles={quoteFiles}
              quoteFileInputRef={quoteFileInputRef}
              handleQuoteFileAdd={handleQuoteFileAdd}
              removeQuoteFile={removeQuoteFile}
              uploadingQuote={uploadingQuote}
              handleUploadQuote={handleUploadQuote}
              respondingQuote={respondingQuote}
              handleApproveQuote={handleApproveQuote}
              showRejectForm={showRejectForm}
              setShowRejectForm={setShowRejectForm}
              rejectionNote={rejectionNote}
              setRejectionNote={setRejectionNote}
              handleRejectQuote={handleRejectQuote}
            />
          )}

          {/* Status action */}
          {canAdvance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {ISSUE_STATUS_LABELS[issue.status as IssueStatus]}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {ISSUE_STATUS_LABELS[nextAction.status]}
                  </span>
                </div>
                <Textarea
                  placeholder="Add a note (optional)..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={2}
                />
                <Button onClick={handleStatusUpdate} disabled={updating}>
                  {updating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {nextAction.label}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          <Card>
            <CardContent className="pt-6">
              <IssueMessageThread issueId={issueId} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardContent className="pt-6">
              <IssueTimeline entries={issue.statusHistory as any} />
            </CardContent>
          </Card>

          {/* Admin notes */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Private notes about this issue..."
                  value={adminNotes || issue.adminNotes || ""}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                >
                  {savingNotes && (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  )}
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Quote Card Component
function QuoteCard({
  issue,
  isAdmin,
  isLandlord,
  showQuoteForm,
  setShowQuoteForm,
  quoteAmount,
  setQuoteAmount,
  quoteDescription,
  setQuoteDescription,
  quoteFiles,
  quoteFileInputRef,
  handleQuoteFileAdd,
  removeQuoteFile,
  uploadingQuote,
  handleUploadQuote,
  respondingQuote,
  handleApproveQuote,
  showRejectForm,
  setShowRejectForm,
  rejectionNote,
  setRejectionNote,
  handleRejectQuote,
}: any) {
  const hasQuote = issue.quoteStatus !== undefined;

  const quoteStatusBadge = {
    pending: { label: "Pending Review", variant: "warning" as const },
    approved: { label: "Approved", variant: "success" as const },
    rejected: { label: "Rejected", variant: "destructive" as const },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Repair Quote
            </CardTitle>
            {hasQuote && (
              <CardDescription>
                Quote submitted for landlord approval
              </CardDescription>
            )}
          </div>
          {hasQuote && (
            <Badge variant={quoteStatusBadge[issue.quoteStatus as keyof typeof quoteStatusBadge]?.variant}>
              {quoteStatusBadge[issue.quoteStatus as keyof typeof quoteStatusBadge]?.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show existing quote */}
        {hasQuote && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-2xl font-bold text-primary">
                {formatXAF(issue.quoteAmount)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">
                {issue.quoteDescription}
              </p>
            </div>

            {/* Quote file thumbnails */}
            {issue.quoteFileIds && issue.quoteFileIds.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Attached Documents</p>
                <div className="flex flex-wrap gap-2">
                  {issue.quoteFileIds.map((fileId: string, i: number) => (
                    <QuoteFilePreview key={fileId} storageId={fileId} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Rejection note */}
            {issue.quoteStatus === "rejected" && issue.quoteRejectionNote && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm font-medium text-destructive mb-1">
                  Rejection Reason
                </p>
                <p className="text-sm">{issue.quoteRejectionNote}</p>
              </div>
            )}

            {/* Landlord approve/reject buttons */}
            {isLandlord && issue.quoteStatus === "pending" && (
              <div className="space-y-3 pt-2">
                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={handleApproveQuote}
                      disabled={respondingQuote}
                    >
                      {respondingQuote ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ThumbsUp className="mr-2 h-4 w-4" />
                      )}
                      Approve Quote
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => setShowRejectForm(true)}
                      disabled={respondingQuote}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Why are you rejecting this quote? (optional)"
                      value={rejectionNote}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setRejectionNote(e.target.value)
                      }
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleRejectQuote}
                        disabled={respondingQuote}
                      >
                        {respondingQuote ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsDown className="mr-2 h-4 w-4" />
                        )}
                        Confirm Reject
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionNote("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin can re-upload quote if rejected */}
            {isAdmin && issue.quoteStatus === "rejected" && !showQuoteForm && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowQuoteForm(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Submit New Quote
              </Button>
            )}
          </div>
        )}

        {/* Admin upload quote button / form */}
        {isAdmin && !hasQuote && !showQuoteForm && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowQuoteForm(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Quote
          </Button>
        )}

        {isAdmin && showQuoteForm && (
          <div className="space-y-4 border rounded-lg p-4">
            <div className="space-y-2">
              <Label htmlFor="quoteAmount">Quote Amount (XAF)</Label>
              <Input
                id="quoteAmount"
                type="number"
                placeholder="e.g., 50000"
                value={quoteAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuoteAmount(e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quoteDesc">Description of Work</Label>
              <Textarea
                id="quoteDesc"
                placeholder="Describe the repair work and cost breakdown..."
                value={quoteDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setQuoteDescription(e.target.value)
                }
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Attach Documents (up to 5)</Label>
              <div className="flex flex-wrap gap-3">
                {quoteFiles.map(
                  (qf: { file: File; preview: string }, i: number) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 rounded-lg border overflow-hidden group"
                    >
                      <img
                        src={qf.preview}
                        alt={`Quote doc ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeQuoteFile(i)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                )}
                {quoteFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => quoteFileInputRef.current?.click()}
                    className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px]">Add</span>
                  </button>
                )}
              </div>
              <input
                ref={quoteFileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={handleQuoteFileAdd}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuoteForm(false);
                  setQuoteAmount("");
                  setQuoteDescription("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadQuote}
                disabled={uploadingQuote || !quoteAmount || !quoteDescription}
              >
                {uploadingQuote && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Quote
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component to preview quote files using Convex storage URLs
function QuoteFilePreview({
  storageId,
  index,
}: {
  storageId: string;
  index: number;
}) {
  const url = useQuery(api.files.getUrl, {
    storageId: storageId as Id<"_storage">,
  });

  if (!url) {
    return (
      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-16 w-16 rounded-lg border overflow-hidden hover:ring-2 hover:ring-primary transition-all"
    >
      <img
        src={url}
        alt={`Quote document ${index + 1}`}
        className="h-full w-full object-cover"
      />
    </a>
  );
}
