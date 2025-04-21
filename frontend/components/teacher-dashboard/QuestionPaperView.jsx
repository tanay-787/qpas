import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Book, Building2, FileText, GraduationCap, Lock, LockOpen } from "lucide-react"
import { PenTool } from "lucide-react";

export default function QuestionPaperView({ questionPapers, loading, refetch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedExaminationType, setSelectedExaminationType] = useState(null);
  const [selectedAccessType, setSelectedAccessType] = useState(null);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(null);
  const [selectedBelongsTo, setSelectedBelongsTo] = useState(null);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg font-semibold">Loading question papers...</p>
      </div>
    );
  }

  if (!questionPapers || questionPapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Nothing here yet!</h2>
        <p className="text-sm text-muted-foreground mt-2">
          No question papers have been added. Please check back later or try refetching.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => refetch()}
        >
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Refetch
        </Button>
      </div>
    );
  }
  

  const subjects = [...new Set(questionPapers.map((paper) => paper.subject))];
  const degrees = [...new Set(questionPapers.map((paper) => paper.degree))];
  const examinationTypes = [
    ...new Set(questionPapers.map((paper) => paper.examinationType)),
  ];

  // Extract unique createdBy and belongsTo values
  const createdByList = [...new Set(questionPapers.map((paper) => paper.createdBy.displayName))];
  const belongsToList = [...new Set(questionPapers.map((paper) => paper.belongsTo.name))];

  const filteredPapers = questionPapers.filter(
    (paper) =>
      (paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSubject ? paper.subject === selectedSubject : true) &&
      (selectedDegree ? paper.degree === selectedDegree : true) &&
      (selectedExaminationType ? paper.examinationType === selectedExaminationType : true) &&
      (selectedAccessType ? paper.accessType.toLowerCase() === selectedAccessType.toLowerCase() : true) && // Normalize case
      (selectedCreatedBy ? paper.createdBy.displayName === selectedCreatedBy : true) &&
      (selectedBelongsTo ? paper.belongsTo.name === selectedBelongsTo : true)
  );


  return (
    <div className="p-6">
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Search Question Papers</h1>
        <p className="text-gray-600 mt-2">
          Browse and filter through available question papers to find what you need.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-4 flex items-center w-full md:w-2/3 mx-auto relative gap-3">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
        <Button
          variant="outline"
          className="flex items-center justify-center"
          onClick={() => {
            refetch();
            setSelectedDegree(null);
            setSelectedSubject(null);
            setSelectedExaminationType(null);
            setSelectedAccessType(null);
            setSelectedCreatedBy(null);
            setSelectedBelongsTo(null);
            setSearchQuery("");
          }}
        >
          <ReloadIcon className="mr-2" /> Refetch Papers
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full md:w-2/3 mx-auto">
        <Select onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
          <SelectTrigger>{selectedSubject || "Subject"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Subject</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedDegree(value === "all" ? null : value)}>
          <SelectTrigger>{selectedDegree || "Degree"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Degree</SelectItem>
            {degrees.map((degree) => (
              <SelectItem key={degree} value={degree}>
                {degree}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedExaminationType(value === "all" ? null : value)}>
          <SelectTrigger>{selectedExaminationType || "Exam Type"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Exam Type</SelectItem>
            {examinationTypes.map((examType) => (
              <SelectItem key={examType} value={examType}>
                {examType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* New Select Dropdown for Access Type */}
        <Select onValueChange={(value) => setSelectedAccessType(value === "all" ? null : value)}>
          <SelectTrigger>{selectedAccessType || "Access Type"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Access Type</SelectItem>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
          </SelectContent>
        </Select>

         {/* New Select Dropdown for Created By */}
         <Select onValueChange={(value) => setSelectedCreatedBy(value === "all" ? null : value)}>
            <SelectTrigger>{selectedCreatedBy || "Created By"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Created By</SelectItem>
              {createdByList.map((createdBy) => (
                <SelectItem key={createdBy} value={createdBy}>
                  {createdBy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* New Select Dropdown for Belongs To */}
          <Select onValueChange={(value) => setSelectedBelongsTo(value === "all" ? null : value)}>
            <SelectTrigger>{selectedBelongsTo || "Belongs To"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Belongs To</SelectItem>
              {belongsToList.map((belongsTo) => (
                <SelectItem key={belongsTo} value={belongsTo}>
                  {belongsTo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>

      {/* Display Filtered Question Papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPapers?.length > 0 ? (
          filteredPapers?.map((paper) => (
            <Card key={paper.qp_id} className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold line-clamp-2">{paper.name}</CardTitle>
                  <Badge variant={paper.accessType === "Public" ? "default" : "secondary"}>
                    {paper.accessType === "Public" ? (
                      <LockOpen className="w-3 h-3 mr-1" />
                    ) : (
                      <Lock className="w-3 h-3 mr-1" />
                    )}
                    {paper.accessType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Subject:</span> {paper.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Degree:</span> {paper.degree}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Exam Type:</span> {paper.examinationType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Created By:</span> {paper.createdBy.displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Belongs :</span> {paper.belongsTo.name}
                    </span>
                  </div>
                </div>
                <Separator />
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                >
                  <a href={paper.documentURL} target="_blank" rel="noopener noreferrer">
                    View Question Paper
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No matching question papers found.</p>
        )}
      </div>
    </div>
  );
}
