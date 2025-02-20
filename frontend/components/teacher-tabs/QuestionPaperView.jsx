import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function QuestionPaperView({
  questionPapers,
  loading,
  refetch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");

  if (loading) return <p>Loading...</p>;
  if (!questionPapers || questionPapers.length === 0)
    return <p>No question papers available.</p>;

  const subjects = [...new Set(questionPapers.map((paper) => paper.subject))];
  const degrees = [...new Set(questionPapers.map((paper) => paper.degree))];

  const filteredPapers = questionPapers.filter(
    (paper) =>
      (paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSubject ? paper.subject === selectedSubject : true) &&
      (selectedDegree ? paper.degree === selectedDegree : true),
  );

  return (
    <div className="p-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Select
          onValueChange={(value) =>
            setSelectedSubject(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-full md:w-1/4">
            {selectedSubject ? selectedSubject : "All Subjects"}
          </SelectTrigger>
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
          <SelectTrigger className="w-full md:w-1/4">
            {selectedDegree ? selectedDegree : "All Degrees"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Degrees</SelectItem>
            {degrees.map((degree) => (
              <SelectItem key={degree} value={degree}>
                {degree}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            refetch();
            setSelectedDegree(null);
            setSelectedSubject(null);
            setSelectedDegree(null);
          }}
        >
          Refetch Papers
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
