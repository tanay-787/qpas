import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstitution } from "../../context/InstitutionContext";

const createQuestionPaper = async ({ institutionId, data }) => {
  const response = await fetch(`/api/${institutionId}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create question paper");
  return response.json();
};

const updateQuestionPaper = async ({ institutionId, qpId, documentURL }) => {
  const response = await fetch(`/api/${institutionId}/update/${qpId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentURL }),
  });
  if (!response.ok) throw new Error("Failed to update document URL");
  return response.json();
};

const QuestionPaperCreate = () => {
  const { institution } = useInstitution();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      semester: "",
      degree: "",
      degreeYear: "",
      examinationType: "Regular",
      accessType: "private",
    }
  });

  const createMutation = useMutation({
    mutationFn: createQuestionPaper,
    onSuccess: () => {
      setStep(2);
      toast({ title: "Success", description: "Question paper details saved successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateQuestionPaper,
    onSuccess: () => {
      toast({ title: "Success", description: "Question paper uploaded successfully" });
      navigate("/dashboard/teacher");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      if (selectedFile.size <= 3 * 1024 * 1024) {
        setFile(selectedFile);
      } else {
        toast({ title: "Error", description: "File size must be less than 3MB", variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "Please select a valid PDF file", variant: "destructive" });
    }
  };

  const onSubmitDetails = (data) => {
    createMutation.mutate({ institutionId: institution.institution_id, data });
  };

  const onUploadDocument = (e) => {
    e.preventDefault();
    if (!file) return;
    const downloadURL = "placeholder_url";
    updateMutation.mutate({ institutionId: institution.institution_id, qpId: "placeholder_qp_id", documentURL: downloadURL });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Question Paper</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-4">
              <div>
                <Label htmlFor="name">Paper Name</Label>
                <Input {...register("name", { required: "Paper name is required" })} />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input {...register("subject", { required: "Subject is required" })} />
                {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
              </div>

              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input {...register("semester", { required: "Semester is required" })} />
                {errors.semester && <p className="text-red-500 text-xs">{errors.semester.message}</p>}
              </div>

              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input {...register("degree", { required: "Degree is required" })} />
                {errors.degree && <p className="text-red-500 text-xs">{errors.degree.message}</p>}
              </div>

              <div>
                <Label htmlFor="degreeYear">Year</Label>
                <Select {...register("degreeYear", { required: "Year is required" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY">First Year</SelectItem>
                    <SelectItem value="SY">Second Year</SelectItem>
                    <SelectItem value="TY">Third Year</SelectItem>
                  </SelectContent>
                </Select>
                {errors.degreeYear && <p className="text-red-500 text-xs">{errors.degreeYear.message}</p>}
              </div>

              <div>
                <Label htmlFor="examinationType">Examination Type</Label>
                <Select {...register("examinationType")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="ATKT">ATKT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accessType">Access Type *</Label>
                <Select {...register("accessType", { required: "Access type is required" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                {errors.accessType && <p className="text-red-500 text-xs">{errors.accessType.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isLoading}>
                {createMutation.isLoading ? "Creating..." : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upload Question Paper</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUploadDocument} className="space-y-4">
              <div>
                <Label htmlFor="file">Question Paper Document (PDF only, max 3MB) *</Label>
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={updateMutation.isLoading || !file}>
                {updateMutation.isLoading ? "Uploading..." : "Upload Document"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionPaperCreate;
