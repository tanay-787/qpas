"use client"
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Settings,
  Compass,
  ListChecks,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  School,
  Search,
  Filter,
  Download,
  Clock,
  Calendar,
  BookMarked,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

const RepositoryImageIcon = ({ className }) => {
  const { theme } = useTheme()
  let effectiveTheme = theme
  if (theme === "system") {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  const imgSrc = effectiveTheme === "dark" ? "/repository-dark.png" : "/repository.png"
  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt="Repository Icon"
      className={cn("h-full w-full object-contain", className)}
    />
  )
}

const sections = [
  {
    Icon: RepositoryImageIcon,
    name: "What is QPAS?",
    description: "Understand the core purpose, mission, and benefits of the QPAS platform.",
    href: "#what-is-qpas",
    cta: "Discover QPAS",
    className: "md:col-span-2",
  },
  {
    Icon: Settings,
    name: "Getting Started",
    description: "Steps to sign in, join institutions, and take your first actions in QPAS.",
    href: "#getting-started",
    cta: "Begin Your Journey",
    className: "md:col-span-1",
  },
  {
    Icon: Compass,
    name: "Navigating QPAS",
    description: "A tour of the main UI elements like the navbar, dashboard access, and theme settings.",
    href: "#navigating-interface",
    cta: "Explore the UI",
    className: "md:col-span-1",
  },
  {
    Icon: ListChecks,
    name: "Features & Dashboards",
    description: "Explore role-specific dashboards (Admin, Teacher, Student) and core QPAS functionalities.",
    href: "#features-and-dashboards",
    cta: "See Features",
    className: "md:col-span-2",
  },
  {
    Icon: Lightbulb,
    name: "Tips & Tricks",
    description: "Get the most out of QPAS with helpful tips and best practices for all users.",
    href: "#tips-and-tricks",
    cta: "Learn Tips",
    className: "md:col-span-3",
  },
  {
    Icon: HelpCircle,
    name: "Support & FAQ",
    description: "Find answers to common questions and learn how to get support if you need it.",
    href: "#support-and-faq",
    cta: "Get Support",
    className: "md:col-span-3",
  },
]

export default function UnderstandingQpas() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight flex items-center justify-center">
          <BookOpen className="mr-4 h-12 w-12 text-primary" /> Understanding QPAS
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to your all-in-one guide for QPAS! Use the quick navigation below to jump to a section, or scroll down
          to explore all the features and tips.
        </p>
      </header>

      <BentoGrid className="mb-24 md:grid-cols-3">
        {sections.map((feature, idx) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>

      <div className="space-y-20">
        <section id="what-is-qpas" className="scroll-mt-20">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <RepositoryImageIcon className="mr-3 h-8 w-8" />
                What is QPAS?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-foreground">
              <h3>Our Core Mission</h3>
              <p>
                QPAS (Question Paper Archive System) is dedicated to revolutionizing how educational institutions manage
                and access examination resources. We aim to provide a centralized, secure, and user-friendly platform
                that streamlines the entire lifecycle of question papers, from creation and storage to retrieval and
                analysis.
              </p>

              <h3>Who is QPAS For?</h3>
              <p>QPAS is designed to serve the diverse needs of the educational community:</p>
              <ul>
                <li>
                  <strong>Students:</strong> Easily access past question papers for exam preparation, understand exam
                  patterns, and enhance their studies.
                </li>
                <li>
                  <strong>Teachers & Educators:</strong> Securely store, organize, and manage question papers.
                  Collaborate on paper creation and ensure consistency in assessments.
                </li>
                <li>
                  <strong>Administrators:</strong> Oversee the institution's entire archive, manage user access, and
                  ensure compliance with academic standards.
                </li>
              </ul>

              <h3>Key Benefits</h3>
              <ul>
                <li>
                  <strong>Centralized Repository:</strong> A single source of truth for all examination papers.
                </li>
                <li>
                  <strong>Easy Access & Retrieval:</strong> Powerful search and filtering to find papers quickly.
                </li>
                <li>
                  <strong>Enhanced Collaboration:</strong> Streamlined workflows for educators.
                </li>
                <li>
                  <strong>Improved Exam Preparation:</strong> Valuable resources for students.
                </li>
                <li>
                  <strong>Secure & Scalable:</strong> Built to protect sensitive data and grow with your institution.
                </li>
              </ul>
              <p>
                We believe that by simplifying access to these vital educational resources, QPAS can contribute
                significantly to academic excellence and a more efficient learning environment.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="getting-started" className="scroll-mt-20">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Settings className="mr-3 h-8 w-8 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-foreground">
              <h3>Creating Your Account</h3>
              <p>Getting started with QPAS is simple and straightforward. Follow these steps to begin your journey:</p>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mt-0">Sign Up</h4>
                  <p>
                    Visit the QPAS login page and select "Create Account." Fill in your details including your name,
                    email address, and create a secure password. Verify your email address through the confirmation link
                    sent to your inbox.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mt-0">Join Your Institution</h4>
                  <p>After logging in, you'll need to join your institution. You can either:</p>
                  <ul>
                    <li>Enter an invitation code provided by your institution administrator</li>
                    <li>Search for your institution and request access (requires approval)</li>
                    <li>Contact your institution's QPAS administrator for assistance</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mt-0">Complete Your Profile</h4>
                  <p>
                    Enhance your QPAS experience by completing your profile. Add your department, role, subjects of
                    interest, and a profile picture. This information helps personalize your experience and enables
                    better collaboration.
                  </p>
                </div>
              </div>

              <h3>First Steps After Setup</h3>
              <p>Once your account is set up and you've joined your institution, we recommend these initial actions:</p>

              <ul>
                <li>
                  <strong>Explore the Dashboard:</strong> Familiarize yourself with your role-specific dashboard
                </li>
                <li>
                  <strong>Browse the Repository:</strong> Search for papers relevant to your courses or interests
                </li>
                <li>
                  <strong>Set Notifications:</strong> Configure your notification preferences for new papers and updates
                </li>
                <li>
                  <strong>Review Access Rights:</strong> Understand what you can view, download, or edit based on your
                  role
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 items-start mt-6">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-800 dark:text-amber-400 font-medium">Important Note</h4>
                  <p className="text-amber-700 dark:text-amber-300 mt-1 mb-0">
                    If you're having trouble accessing your institution or need your role adjusted, please contact your
                    institution's QPAS administrator. Only administrators can modify user roles and institutional
                    access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="navigating-interface" className="scroll-mt-20">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Compass className="mr-3 h-8 w-8 text-primary" />
                Navigating QPAS
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-foreground">
              <h3>Understanding the Interface</h3>
              <p>
                QPAS features an intuitive, user-friendly interface designed to make navigation simple and efficient.
                Here's a breakdown of the main UI elements:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <BookMarked className="h-5 w-5 text-primary" />
                    </div>
                    Top Navigation Bar
                  </h4>
                  <p className="mt-0">The persistent navigation bar at the top of every page contains:</p>
                  <ul className="mt-2">
                    <li>QPAS logo (click to return to dashboard)</li>
                    <li>Global search function</li>
                    <li>Notifications bell</li>
                    <li>User profile menu</li>
                    <li>Institution selector (if you belong to multiple)</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    Sidebar Navigation
                  </h4>
                  <p className="mt-0">The collapsible sidebar provides access to:</p>
                  <ul className="mt-2">
                    <li>Dashboard</li>
                    <li>Repository</li>
                    <li>My Papers</li>
                    <li>Favorites</li>
                    <li>Recent Activity</li>
                    <li>Settings</li>
                  </ul>
                </div>
              </div>

              <h3>Key Navigation Features</h3>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mt-0">Global Search</h4>
                  <p>
                    Access the search function from any page by clicking the search icon or using the keyboard shortcut{" "}
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{" "}
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>. Search across papers, subjects,
                    courses, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mt-0">Quick Filters</h4>
                  <p>
                    Use the filter bar to quickly narrow down results by year, subject, paper type, or difficulty level.
                    Saved filters appear in your sidebar for easy access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mt-0">Recent Activity</h4>
                  <p>
                    Access your recently viewed papers and searches from the Recent Activity section. This helps you
                    quickly return to papers you've been working with.
                  </p>
                </div>
              </div>

              <h3>Customizing Your Experience</h3>
              <p>QPAS allows you to personalize your interface for optimal productivity:</p>

              <ul>
                <li>
                  <strong>Theme Settings:</strong> Toggle between light, dark, and system theme modes via the user
                  profile menu
                </li>
                <li>
                  <strong>Dashboard Layout:</strong> Rearrange dashboard widgets by dragging and dropping them
                </li>
                <li>
                  <strong>Sidebar Collapse:</strong> Toggle the sidebar width to maximize screen space
                </li>
                <li>
                  <strong>Notification Preferences:</strong> Customize which alerts you receive and how
                </li>
              </ul>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3 items-start mt-6">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-primary font-medium">Pro Tip</h4>
                  <p className="mt-1 mb-0">
                    Use keyboard shortcuts to navigate faster. View all available shortcuts by pressing{" "}
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> from any page in QPAS.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="features-and-dashboards" className="scroll-mt-20">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <ListChecks className="mr-3 h-8 w-8 text-primary" />
                Features & Dashboards
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-foreground">
              <h3>Role-Specific Dashboards</h3>
              <p>
                QPAS provides tailored dashboards based on your role within the institution, ensuring you have the tools
                and information most relevant to your needs:
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-6">
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    Administrator Dashboard
                  </h4>
                  <ul className="mt-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>User management and access control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Institution-wide analytics and reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>System configuration and customization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Department and course management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Approval workflows and moderation</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <School className="h-5 w-5 text-primary" />
                    </div>
                    Teacher Dashboard
                  </h4>
                  <ul className="mt-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Paper creation and management tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Subject-specific repositories</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Collaboration with department colleagues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Question bank and template access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Paper usage and effectiveness analytics</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    Student Dashboard
                  </h4>
                  <ul className="mt-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Access to approved past papers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Study resources and practice materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Personal favorites and collections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Course-specific paper organization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Exam preparation tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3>Core Features</h3>

              <div className="space-y-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md flex-shrink-0 mt-1">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mt-0">Advanced Search & Filtering</h4>
                    <p className="mt-1">
                      QPAS offers powerful search capabilities that allow you to find exactly what you need:
                    </p>
                    <ul>
                      <li>Full-text search across all paper content</li>
                      <li>Multi-criteria filtering (year, subject, type, difficulty)</li>
                      <li>Saved searches for frequently used queries</li>
                      <li>Metadata-based search (authors, tags, keywords)</li>
                      <li>Similar paper recommendations</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md flex-shrink-0 mt-1">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mt-0">Paper Management</h4>
                    <p className="mt-1">Create, store, and organize question papers with ease:</p>
                    <ul>
                      <li>Structured paper creation with templates</li>
                      <li>Version control and revision history</li>
                      <li>Collaborative editing with permission controls</li>
                      <li>Metadata tagging and categorization</li>
                      <li>Approval workflows and publishing controls</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md flex-shrink-0 mt-1">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mt-0">Access & Distribution</h4>
                    <p className="mt-1">Access papers in various formats and share them securely:</p>
                    <ul>
                      <li>Multiple export formats (PDF, Word, HTML)</li>
                      <li>Secure sharing with access controls</li>
                      <li>Watermarking and DRM options</li>
                      <li>Offline access for approved papers</li>
                      <li>Batch download capabilities</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md flex-shrink-0 mt-1">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mt-0">Analytics & Insights</h4>
                    <p className="mt-1">Gain valuable insights into paper usage and effectiveness:</p>
                    <ul>
                      <li>Usage statistics and access patterns</li>
                      <li>Question difficulty analysis</li>
                      <li>Topic coverage visualization</li>
                      <li>Trend analysis across academic years</li>
                      <li>Custom reports for administrators</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3 items-start mt-8">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-primary font-medium">Feature Availability</h4>
                  <p className="mt-1 mb-0">
                    Feature availability may vary based on your institution's QPAS subscription tier and your assigned
                    role. Contact your administrator to request access to specific features if needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="tips-and-tricks" className="scroll-mt-20">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Lightbulb className="mr-3 h-8 w-8 text-primary" />
                Tips & Tricks
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-foreground">
              <h3>For All Users</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium mb-3">Keyboard Shortcuts</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Global Search</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Save Current Paper</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">S</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Toggle Sidebar</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">B</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Help Menu</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quick Actions</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">J</kbd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium mb-3">Search Like a Pro</h4>
                  <ul className="mt-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Use quotes for exact phrases: <code>"quantum physics"</code>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Exclude terms with minus: <code>calculus -basic</code>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Use OR for alternatives: <code>midterm OR "mid term"</code>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Filter by year: <code>year:2023</code> or <code>year:2020-2023</code>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Filter by author: <code>author:"Dr. Smith"</code>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3>Role-Specific Tips</h3>

              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-5">
                  <h4 className="text-lg font-medium text-primary mb-3">For Administrators</h4>
                  <ul className="mt-0 space-y-3">
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Batch User Management:</strong> Use the CSV import feature to add multiple users at once
                        rather than adding them individually.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Custom Role Templates:</strong> Create role templates with predefined permissions for
                        different types of users (e.g., Department Heads, Teaching Assistants).
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Scheduled Reports:</strong> Set up automated weekly or monthly reports to monitor system
                        usage and paper access patterns.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-5">
                  <h4 className="text-lg font-medium text-primary mb-3">For Teachers</h4>
                  <ul className="mt-0 space-y-3">
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Paper Templates:</strong> Create and save templates for different types of assessments
                        to maintain consistency and save time.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Question Bank:</strong> Build a personal question bank by tagging questions with topics
                        and difficulty levels for easy reuse.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Collaborative Editing:</strong> Use the "Share for Review" feature to get feedback from
                        colleagues before finalizing papers.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-5">
                  <h4 className="text-lg font-medium text-primary mb-3">For Students</h4>
                  <ul className="mt-0 space-y-3">
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Study Collections:</strong> Create topic-based collections of papers to organize your
                        exam preparation.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Pattern Recognition:</strong> Use the "Compare Papers" feature to identify recurring
                        question patterns across multiple years.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Offline Access:</strong> Download important papers before exams to ensure access even
                        without internet connectivity.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <h3>Efficiency Boosters</h3>
              <p>These general tips can help all users make the most of QPAS:</p>

              <ul>
                <li>
                  <strong>Saved Filters:</strong> Save frequently used search filters for quick access
                </li>
                <li>
                  <strong>Browser Bookmarks:</strong> Bookmark specific papers or searches for instant access
                </li>
                <li>
                  <strong>Notifications:</strong> Customize your notification settings to stay informed without being
                  overwhelmed
                </li>
                <li>
                  <strong>Mobile App:</strong> Install the QPAS mobile app for on-the-go access to your papers
                </li>
                <li>
                  <strong>Dark Mode:</strong> Switch to dark mode to reduce eye strain during extended use
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 items-start mt-6">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-800 dark:text-amber-400 font-medium">Remember</h4>
                  <p className="text-amber-700 dark:text-amber-300 mt-1 mb-0">
                    QPAS is regularly updated with new features and improvements. Check the "What's New" section in the
                    help menu periodically to discover the latest capabilities and enhancements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="support-and-faq" className="scroll-mt-20">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <HelpCircle className="mr-3 h-8 w-8 text-primary" />
                Support & FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-foreground">
              <h3>Frequently Asked Questions</h3>

              <div className="space-y-6 mb-8">
                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium mb-2">Account & Access</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">How do I reset my password?</p>
                      <p className="text-muted-foreground mt-0">
                        Click "Forgot Password" on the login screen and follow the instructions sent to your registered
                        email address. If you don't receive the email, check your spam folder or contact your
                        institution administrator.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Can I belong to multiple institutions?</p>
                      <p className="text-muted-foreground mt-0">
                        Yes, QPAS supports multi-institution access. Once logged in, you can switch between institutions
                        using the dropdown in the top navigation bar.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">How do I request a role change?</p>
                      <p className="text-muted-foreground mt-0">
                        Role changes must be approved by your institution administrator. Contact them directly or use
                        the "Request Role Change" option in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium mb-2">Using QPAS</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Can I edit papers created by others?</p>
                      <p className="text-muted-foreground mt-0">
                        This depends on your role and the specific permissions set by the paper owner. Generally, only
                        the creator and designated collaborators can edit papers.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">How do I share papers with specific users?</p>
                      <p className="text-muted-foreground mt-0">
                        Open the paper, click the "Share" button, and enter the email addresses of the users you want to
                        share with. You can set specific permissions for each user (view, comment, or edit).
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Is there a limit to how many papers I can store?</p>
                      <p className="text-muted-foreground mt-0">
                        Storage limits depend on your institution's subscription plan. Administrators can view current
                        usage and limits in the system settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium mb-2">Technical Issues</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">Why can't I upload certain file types?</p>
                      <p className="text-muted-foreground mt-0">
                        QPAS supports PDF, DOCX, PPTX, and common image formats. For security reasons, executable files
                        and certain other formats are restricted. Contact support if you need to use an unsupported
                        format.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">The system is running slowly. What can I do?</p>
                      <p className="text-muted-foreground mt-0">
                        Try clearing your browser cache, using a different browser, or accessing during off-peak hours.
                        If problems persist, report the issue to support with details about your device and connection.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Can I use QPAS offline?</p>
                      <p className="text-muted-foreground mt-0">
                        The mobile app offers limited offline functionality. You can download papers for offline
                        viewing, but most features require an internet connection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h3>Getting Support</h3>
              <p>
                If you need assistance beyond what's covered in this documentation, QPAS offers several support
                channels:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    In-App Help
                  </h4>
                  <ul className="mt-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Click the Help icon in the bottom of the sidebar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Use the search function to find specific topics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Access guided tutorials and video walkthroughs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>View contextual help for specific features</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-5">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-1.5 rounded-md">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    Direct Support
                  </h4>
                  <ul className="mt-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Email: support@qpas.edu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Live chat: Available weekdays 9am-5pm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Support ticket: Submit via the Help menu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span>Phone: +1-555-QPAS-HELP (Premium support)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3>Institutional Support</h3>
              <p>
                For institution-specific issues, your local QPAS administrator is often the best first point of contact:
              </p>
              <ul>
                <li>They can resolve access issues and role assignments</li>
                <li>They have direct channels to QPAS support for escalation</li>
                <li>They can provide institution-specific guidance and policies</li>
                <li>They can organize training sessions for your department</li>
              </ul>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3 items-start mt-6">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-primary font-medium">Support Tip</h4>
                  <p className="mt-1 mb-0">
                    When contacting support, include as much detail as possible: your browser/device, steps to reproduce
                    the issue, screenshots if applicable, and any error messages you received. This helps us resolve
                    your issue more quickly.
                  </p>
                </div>
              </div>

              <h3>Feedback & Feature Requests</h3>
              <p>
                QPAS is constantly evolving based on user feedback. We encourage you to share your ideas and
                suggestions:
              </p>
              <ul>
                <li>Use the "Feedback" option in the Help menu</li>
                <li>Join our quarterly user feedback sessions (announced via email)</li>
                <li>Participate in beta testing of new features</li>
                <li>Contact your institution administrator with feature requests</li>
              </ul>

              <div className="text-center mt-12 p-6 border rounded-lg bg-primary/5">
                <h3 className="text-2xl font-bold text-primary mb-3">Still Need Help?</h3>
                <p className="mb-4">Our support team is ready to assist you with any questions or issues.</p>
                <div className="flex justify-center gap-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Contact Support
                  </button>
                  <button className="px-4 py-2 bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    View Knowledge Base
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}