import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Download } from "lucide-react";

interface ResumePreviewProps {
  resume: any;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resume Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <FileText className="h-16 w-16 mb-4 opacity-50" />
            <p>Select a resume to preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-96 overflow-y-auto">
          <div className="bg-white p-6 shadow-sm text-xs leading-relaxed min-h-full">
            {resume.content ? (
              <div>
                {/* Personal Info Section */}
                <div className="text-center border-b pb-4 mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {resume.content.personalInfo?.name || "Your Name"}
                  </h2>
                  <p className="text-gray-600">
                    {resume.content.personalInfo?.title || "Professional Title"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {resume.content.personalInfo?.email || "email@example.com"} | 
                    {resume.content.personalInfo?.phone || "(555) 123-4567"}
                  </p>
                </div>

                {/* Experience Section */}
                {resume.content.experience && resume.content.experience.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">EXPERIENCE</h3>
                    <div className="space-y-2">
                      {resume.content.experience.map((exp: any, index: number) => (
                        <div key={index}>
                          <div className="font-medium">{exp.title} - {exp.company}</div>
                          <div className="text-gray-600">{exp.duration}</div>
                          {exp.achievements && (
                            <ul className="text-gray-700 text-xs ml-4 mt-1 list-disc">
                              {exp.achievements.map((achievement: string, i: number) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {resume.content.skills && resume.content.skills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">SKILLS</h3>
                    <div className="text-gray-700 text-xs">
                      {resume.content.skills.join(", ")}
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {resume.content.education && resume.content.education.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">EDUCATION</h3>
                    <div className="space-y-2">
                      {resume.content.education.map((edu: any, index: number) => (
                        <div key={index}>
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-gray-600">{edu.school} - {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Resume content not available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <Button className="flex-1 bg-primary text-white hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Resume
          </Button>
          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
