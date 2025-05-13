"use client"

//hooks & utils
import { useState } from "react"
import { useInstitution } from "@/context/InstitutionContext"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

//ui-components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

//icons
import { Book, FileText, GraduationCap, Lock, LockOpen, Pencil, Search, Trash2 } from "lucide-react"


const QuestionPaperManage = () => {
    const { institution } = useInstitution()
    const { toast } = useToast()
    const [editingPaper, setEditingPaper] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch question papers
    const {
        data: questionPapers,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["manage-question-papers", institution?.inst_id],
        queryFn: async () => {
            const response = await axios.get(`/api/question-papers/${institution.inst_id}/teacher`)
            return response.data
        },
        enabled: !!institution?.inst_id,
    })

    // Update question paper mutation
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.put(`/api/question-papers/${institution.inst_id}/update/${data.paperId}`, data.updates)
            return response.data
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Question paper updated successfully",
            })
            refetch()
            setEditingPaper(null)
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update question paper",
                variant: "destructive",
            })
        },
    })

    // Delete question paper mutation
    const deleteMutation = useMutation({
        mutationFn: async (paperId) => {
            const response = await axios.delete(`/api/question-papers/${institution.inst_id}/delete/${paperId}`)
            return response.data
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Question paper deleted successfully",
            })
            refetch()
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete question paper",
                variant: "destructive",
            })
        },
    })

    const handleUpdatePaper = (formData) => {
        updateMutation.mutate({
            paperId: editingPaper.qp_id,
            updates: formData,
        })
    }

    const handleDeletePaper = (paperId) => {
        deleteMutation.mutate(paperId)
    }

    const filteredPapers = questionPapers?.filter((paper) => paper.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-[300px]" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-[120px]" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Manage Your Question Papers</h1>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by paper name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {filteredPapers?.length === 0 ? (
                <Card className="flex h-[300px] flex-col items-center justify-center text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No question papers found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms.</p>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPapers?.map((paper) => (
                        <Card key={paper.qp_id} className="group relative overflow-hidden">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-lg font-semibold leading-tight">{paper.name}</CardTitle>
                                    <Badge variant={paper.accessType === "public" ? "primary" : "secondary"}>
                                        {paper.accessType === "public" ? (
                                            <LockOpen className="mr-1 h-3 w-3 text-primary-foreground dark:text-primary" />
                                        ) : (
                                            <Lock className="mr-1 h-3 w-3 text-primary-foreground dark:text-primary" />
                                        )}
                                        {paper.accessType}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-2">
                                        <Book className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Subject:</span> {paper.subject}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Degree:</span> {paper.degree}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Type:</span> {paper.examinationType}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex p-2 justify-end gap-2 text-primary-foreground dark:text-primary">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                >
                                    <a href={paper.documentUrl} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => setEditingPaper(paper)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Question Paper</DialogTitle>
                                            <DialogDescription>Make changes to the question paper details here.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Paper Name</Label>
                                                <Input
                                                    id="name"
                                                    defaultValue={paper.name}
                                                    onChange={(e) => setEditingPaper({ ...editingPaper, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    defaultValue={paper.subject}
                                                    onChange={(e) => setEditingPaper({ ...editingPaper, subject: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="degree">Degree</Label>
                                                <Input
                                                    id="degree"
                                                    defaultValue={paper.degree}
                                                    onChange={(e) => setEditingPaper({ ...editingPaper, degree: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="examinationType">Examination Type</Label>
                                                <Select
                                                    id="examinationType"
                                                    value={editingPaper?.examinationType || ""}
                                                    onValueChange={(value) => setEditingPaper({ ...editingPaper, examinationType: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select examination type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Regular">Regular</SelectItem>
                                                        <SelectItem value="ATKT">ATKT</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="accessType">Access Type</Label>
                                                <Select
                                                    id="accessType"
                                                    value={editingPaper?.accessType || ""}
                                                    onValueChange={(value) => setEditingPaper({ ...editingPaper, accessType: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select access type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="public">Public</SelectItem>
                                                        <SelectItem value="private">Private</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                        </div>
                                        <DialogFooter>
                                            <Button onClick={() => handleUpdatePaper(editingPaper)}>Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="text-destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the question paper.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => handleDeletePaper(paper.qp_id)}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default QuestionPaperManage

