import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstitution } from "../../context/InstitutionContext";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Controller } from "react-hook-form";


const createQuestionPaper = async ({ institutionId, formData }) => {
  try {
    const response = await axios.post(
      `/api/question-papers/${institutionId}/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create question paper",
    );
  }
};

const QuestionPaperCreate = () => {
  const { user } = useAuth();
  const { institution } = useInstitution();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      semester: "",
      stream: "",
      degree: "",
      examinationType: "Regular",
      accessType: "private",
    },
  });
  

  const createMutation = useMutation({
    mutationFn: createQuestionPaper,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Question paper created successfully",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    // enabled: !!(user.role === "teacher"),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      if (selectedFile.size <= 3 * 1024 * 1024) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Error",
          description: "File size must be less than 3MB",
          variant: "destructive",
        });
        e.target.value = null;
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a valid PDF file",
        variant: "destructive",
      });
      e.target.value = null;
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Append all form fields
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    console.log([...formData.entries()]);

    createMutation.mutate({
      institutionId: institution.inst_id,
      formData,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Question Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Paper Name</Label>
              <Input
                placeholder="Enter paper name"
                {...register("name", { required: "Paper name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                placeholder="Enter subject name"
                {...register("subject", { required: "Subject is required" })}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                placeholder="Enter degree name (e.g., B.Tech, BCA, BSCIT...)"
                {...register("degree", { required: "Degree is required" })}
              />
              {errors.degree && (
                <p className="text-red-500 text-xs">{errors.degree.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="examinationType">Examination Type</Label>
              <Controller
                name="examinationType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="ATKT">ATKT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>


            <div>
              <Label htmlFor="accessType">Access Type *</Label>
              <Controller
                name="accessType"
                control={control}
                rules={{ required: "Access type is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.accessType && (
                <p className="text-red-500 text-xs">{errors.accessType.message}</p>
              )}
            </div>


            <div>
              <Label htmlFor="file">
                Question Paper Document (PDF only, max 3MB) *
              </Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isLoading || !file}
            >
              {createMutation.isLoading
                ? "Creating..."
                : "Create Question Paper"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionPaperCreate;
