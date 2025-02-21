import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function QuestionPaperView({
  questionPapers,
  loading,
  refetch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedExaminationType, setSelectedExaminationType] = useState(null);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg font-semibold">Loading question papers...</p>
      </div>
    );
  }

  if (!questionPapers || questionPapers.length === 0) {
    return <p>No question papers available.</p>;
  }

  const subjects = [...new Set(questionPapers.map((paper) => paper.subject))];
  const degrees = [...new Set(questionPapers.map((paper) => paper.degree))];
  const examinationTypes = [
    ...new Set(questionPapers.map((paper) => paper.examinationType)),
  ];

  const filteredPapers = questionPapers.filter(
    (paper) =>
      (paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSubject ? paper.subject === selectedSubject : true) &&
      (selectedDegree ? paper.degree === selectedDegree : true) &&
      (selectedExaminationType
        ? paper.examinationType === selectedExaminationType
        : true),
  );

  return (
    <div className="p-6">
      {/* Heading & Subheading */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Search Question Papers</h1>
        <p className="text-gray-600 mt-2">
          Browse and filter through available question papers to find what you
          need.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-4 flex items-center w-full md:w-2/3 mx-auto relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search by name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full md:w-2/3 mx-auto">
        <Select
          onValueChange={(value) =>
            setSelectedSubject(value === "all" ? null : value)
          }
        >
          <SelectTrigger>{selectedSubject || "All Subjects"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setSelectedDegree(value === "all" ? null : value)
          }
        >
          <SelectTrigger>{selectedDegree || "All Degrees"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Degrees</SelectItem>
            {degrees.map((degree) => (
              <SelectItem key={degree} value={degree}>
                {degree}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setSelectedExaminationType(value === "all" ? null : value)
          }
        >
          <SelectTrigger>
            {selectedExaminationType || "All Examination Types"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Examination Types</SelectItem>
            {examinationTypes.map((examType) => (
              <SelectItem key={examType} value={examType}>
                {examType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="flex items-center justify-center"
          onClick={() => {
            refetch();
            setSelectedDegree(null);
            setSelectedSubject(null);
            setSelectedExaminationType(null);
            setSearchQuery("");
          }}
        >
          <ReloadIcon className="mr-2" /> Refetch
        </Button>
      </div>

      {/* Display Filtered Question Papers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <Card key={paper.qp_id}>
              <CardHeader>
                <CardTitle>{paper.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Subject:</strong> {paper.subject}
                </p>
                <p>
                  <strong>Degree:</strong> {paper.degree}
                </p>
                <p>
                  <strong>Exam Type:</strong> {paper.examinationType}
                </p>
                <p>
                  <strong>Access:</strong> {paper.accessType}
                </p>
                <a
                  href={paper.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View PDF
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No matching question papers found.</p>
        )}
      </div>
    </div>
  );
}
