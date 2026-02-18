//hooks & utils
import { useNavigate } from "react-router-dom"

//ui-components
import { Button } from "@/components/ui/button"
import TryDemoDialog from "@/components/try-demo-dialog"

//icons
import { ArrowRight, BookOpen, Database, Search, Users, CheckCircle, FileText } from "lucide-react"
import { ArrowUpRight } from "lucide-react"

export default function LandingPage() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen">
            <div className="flex flex-col bg-gradient-to-b from-background to-secondary">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="relative flex flex-col items-center justify-center px-4 py-20 md:py-32">
                        <div className="container mx-auto max-w-6xl text-center z-10">
                            <div className="mb-8">
                                <span className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary-foreground dark:text-primary">
                                    Educational Resource Management
                                </span>
                                <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-8xl ">
                                    Question Paper Archives
                                </h1>
                                <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                                    A centralized digital repository for educational institutions to store, manage, and access examination
                                    question papers efficiently.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="px-8 font-medium" onClick={() => navigate("/browse-institutions")}>
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <TryDemoDialog />
                                </div>
                            </div>
                            <div className="relative mx-auto mt-12 w-full max-w-5xl rounded-xl border bg-background/80 backdrop-blur-sm shadow-2xl">
                                <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <div className="absolute inset-0 w-full h-full">
                                        <div className="aspect-video w-full overflow-hidden rounded-xl">
                                            <img src="/qpas-hero-img.webp" loading="lazy" alt="Hero Image" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-24"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                                    <div className="flex flex-col items-center p-4 text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <Database className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold">Centralized Storage</h3>
                                        <p className="text-sm text-muted-foreground">Store all question papers in one secure location</p>
                                    </div>
                                    <div className="flex flex-col items-center p-4 text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <Search className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold">Easy Retrieval</h3>
                                        <p className="text-sm text-muted-foreground">Find past papers quickly with powerful search</p>
                                    </div>
                                    <div className="flex flex-col items-center p-4 text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold">Collaborative Access</h3>
                                        <p className="text-sm text-muted-foreground">Share with teachers and students securely</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Powerful Features for Educational Excellence</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Our platform provides everything educators need to manage examination resources effectively.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-background p-6 rounded-xl shadow-sm border">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Comprehensive Archives</h3>
                                <p className="text-muted-foreground mb-4">
                                    Store question papers from all subjects, courses, and academic years in one place.
                                </p>
                                <ul className="space-y-2">
                                    {["Multiple formats supported", "Version history", "Categorized storage"].map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                                    <Search className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
                                <p className="text-muted-foreground mb-4">
                                    Find exactly what you need with powerful filtering and search capabilities.
                                </p>
                                <ul className="space-y-2">
                                    {["Filter by subject/year", "Full-text search", "Tag-based organization"].map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-background p-6 rounded-xl shadow-sm border">
                                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
                                <p className="text-muted-foreground mb-4">
                                    Control who can view, edit, and manage question papers with granular permissions.
                                </p>
                                <ul className="space-y-2">
                                    {["Admin controls", "Teacher access", "Student view options"].map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Testimonials */}
                <section className="py-20 bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Trusted by Educators</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                See what educational institutions are saying about our platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    quote:
                                        "QPAS has revolutionized how we manage our examination resources. It's now so much easier to prepare for exams.",
                                    author: "Prof. Smita Nair",
                                    role: "Department Head, Information Technology",
                                },
                                {
                                    quote:
                                        "Students appreciate having access to past papers, which has significantly improved their exam preparation.",

                                    author: "Prof. Rajnish Prajapati",
                                    role: "Senior Professor",
                                },
                                {
                                    quote:
                                        "The search functionality alone has saved our faculty countless hours when preparing new assessments.",
                                    author: "Dr. Vivekkumar Patil",
                                    role: "Principal, Royal College",
                                },
                            ].map((testimonial, i) => (
                                <div key={i} className="bg-background p-6 rounded-xl shadow-sm border">
                                    <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-semibold">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="relative overflow-hidden rounded-2xl bg-accent p-8 md:p-12">
                            {/* <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80"></div> */}
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                                        Ready to Transform Your Question Paper Management?
                                    </h2>
                                    <p className="text-secondary-foreground max-w-xl">
                                        Join educational institutions that are already benefiting from our centralized question paper
                                        repository.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="px-8 font-medium" onClick={() => navigate("/browse-institutions")}>
                                        Get Started <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="px-8 font-medium"
                                    >
                                        Request Demo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <p className="text-sm text-muted-foreground">
                                    © {new Date().getFullYear()} Question Paper Archives. All rights reserved.
                                </p>
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                    Terms
                                </a>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                    Privacy
                                </a>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

