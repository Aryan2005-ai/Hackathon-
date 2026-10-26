
import { useState, type FormEvent } from "react";

type Education = {
  degree: string;
  institution: string;
  graduationYear: string;
  cgpa: string;
};

type Project = {
  title: string;
  description: string;
  technologies: string;
  projectUrl: string;
};

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Certification = {
  name: string;
  issuer: string;
  year: string;
};

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;

  education: Education[];

  technicalSkills: string;
  softSkills: string;

  projects: Project[];
  experience: Experience[];
  certifications: Certification[];

  preferredRoles: string;
  preferredLocations: string;
  employmentType: string;
  experienceLevel: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
};

const initialForm: ProfileForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  summary: "",

  education: [
    {
      degree: "",
      institution: "",
      graduationYear: "",
      cgpa: "",
    },
  ],

  technicalSkills: "",
  softSkills: "",

  projects: [
    {
      title: "",
      description: "",
      technologies: "",
      projectUrl: "",
    },
  ],

  experience: [],
  certifications: [],

  preferredRoles: "",
  preferredLocations: "",
  employmentType: "Full-time",
  experienceLevel: "Fresher",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 " +
  "text-gray-900 outline-none transition focus:border-blue-500 " +
  "focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

export default function ProfileCreation() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [message, setMessage] = useState("");

  function updateField<K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateArrayItem<
    K extends "education" | "projects" | "experience" | "certifications"
  >(
    field: K,
    index: number,
    key: keyof ProfileForm[K][number],
    value: string
  ) {
    setForm((previous) => {
      const updatedItems = [...previous[field]];

      updatedItems[index] = {
        ...updatedItems[index],
        [key]: value,
      };

      return {
        ...previous,
        [field]: updatedItems,
      };
    });
  }

  function addArrayItem(
    field: "education" | "projects" | "experience" | "certifications"
  ) {
    setForm((previous) => {
      switch (field) {
        case "education":
          return {
            ...previous,
            education: [
              ...previous.education,
              {
                degree: "",
                institution: "",
                graduationYear: "",
                cgpa: "",
              },
            ],
          };

        case "projects":
          return {
            ...previous,
            projects: [
              ...previous.projects,
              {
                title: "",
                description: "",
                technologies: "",
                projectUrl: "",
              },
            ],
          };

        case "experience":
          return {
            ...previous,
            experience: [
              ...previous.experience,
              {
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
          };

        case "certifications":
          return {
            ...previous,
            certifications: [
              ...previous.certifications,
              {
                name: "",
                issuer: "",
                year: "",
              },
            ],
          };
      }
    });
  }

  function removeArrayItem(
    field: "education" | "projects" | "experience" | "certifications",
    index: number
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!form.fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (form.education.length === 0) {
      setMessage("Please add at least one education entry.");
      return;
    }

    // Temporary frontend-only preview.
    // Supabase persistence will be implemented in the next step.
    console.log("Profile form data:", form);

    setMessage(
      "Profile form validated successfully. Open the browser console to view the data. It has not been saved to Supabase yet."
    );
  }

  const Section = ({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            RADIX Talent Match
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Create Your Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Build your professional profile to help match your skills with
            relevant career opportunities.
          </p>
        </header>

        {message && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Personal information */}
          <Section
            title="1. Personal Information"
            description="Tell us about yourself."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  className={inputClass}
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  className={inputClass}
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Professional Headline</label>
                <input
                  className={inputClass}
                  value={form.headline}
                  onChange={(e) => updateField("headline", e.target.value)}
                  placeholder="e.g. BCA Graduate | Aspiring Data Analyst"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Professional Summary</label>
                <textarea
                  className={inputClass}
                  rows={4}
                  maxLength={1500}
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  placeholder="Describe your background, strengths, and career goals..."
                />
                <p className="mt-1 text-right text-xs text-gray-500">
                  {form.summary.length}/1500 characters
                </p>
              </div>
            </div>
          </Section>

          {/* 2. Education */}
          <Section
            title="2. Education"
            description="Add your degree, college, and academic details."
          >
            <div className="space-y-5">
              {form.education.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">
                      Education {index + 1}
                    </h3>

                    {form.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("education", index)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input
                        className={inputClass}
                        value={item.degree}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        placeholder="e.g. BCA"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Institution</label>
                      <input
                        className={inputClass}
                        value={item.institution}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        placeholder="College or university"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input
                        className={inputClass}
                        type="number"
                        min="1950"
                        max="2100"
                        value={item.graduationYear}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "graduationYear",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 2026"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>CGPA / Percentage</label>
                      <input
                        className={inputClass}
                        value={item.cgpa}
                        onChange={(e) =>
                          updateArrayItem(
                            "education",
                            index,
                            "cgpa",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 8.2 CGPA or 78%"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addArrayItem("education")}
              className="mt-4 text-sm font-medium text-blue-600 hover:underline"
            >
              + Add Education
            </button>
          </Section>

          {/* 3. Skills */}
          <Section
            title="3. Skills"
            description="Separate multiple skills using commas."
          >
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Technical Skills</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.technicalSkills}
                  onChange={(e) =>
                    updateField("technicalSkills", e.target.value)
                  }
                  placeholder="Python, Java, SQL, React, Power BI..."
                />
              </div>

              <div>
                <label className={labelClass}>Soft Skills</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.softSkills}
                  onChange={(e) => updateField("softSkills", e.target.value)}
                  placeholder="Communication, teamwork, problem-solving..."
                />
              </div>
            </div>
          </Section>

          {/* 4. Projects */}
          <Section
            title="4. Projects"
            description="Showcase academic, personal, or professional projects."
          >
            <div className="space-y-5">
              {form.projects.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">
                      Project {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeArrayItem("projects", index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Project Title</label>
                      <input
                        className={inputClass}
                        value={item.title}
                        onChange={(e) =>
                          updateArrayItem(
                            "projects",
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Student Management System"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        className={inputClass}
                        rows={3}
                        value={item.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "projects",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Explain what the project does and your contribution."
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Technologies Used</label>
                      <input
                        className={inputClass}
                        value={item.technologies}
                        onChange={(e) =>
                          updateArrayItem(
                            "projects",
                            index,
                            "technologies",
                            e.target.value
                          )
                        }
                        placeholder="Python, FastAPI, MySQL..."
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Project URL</label>
                      <input
                        className={inputClass}
                        type="url"
                        value={item.projectUrl}
                        onChange={(e) =>
                          updateArrayItem(
                            "projects",
                            index,
                            "projectUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addArrayItem("projects")}
              className="mt-4 text-sm font-medium text-blue-600 hover:underline"
            >
              + Add Project
            </button>
          </Section>

          {/* 5. Work experience */}
          <Section
            title="5. Work Experience"
            description="Optional for freshers. Internships can be included here."
          >
            {form.experience.length === 0 && (
              <p className="text-sm text-gray-500">
                No experience added. You can skip this section if you are a
                fresher.
              </p>
            )}

            <div className="space-y-5">
              {form.experience.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">
                      Experience {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeArrayItem("experience", index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        className={inputClass}
                        value={item.company}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input
                        className={inputClass}
                        value={item.role}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "role",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Software Developer Intern"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input
                        className={inputClass}
                        type="date"
                        value={item.startDate}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>End Date</label>
                      <input
                        className={inputClass}
                        type="date"
                        value={item.endDate}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Responsibilities</label>
                      <textarea
                        className={inputClass}
                        rows={3}
                        value={item.description}
                        onChange={(e) =>
                          updateArrayItem(
                            "experience",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your work and achievements."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addArrayItem("experience")}
              className="mt-4 text-sm font-medium text-blue-600 hover:underline"
            >
              + Add Experience
            </button>
          </Section>

          {/* 6. Certifications */}
          <Section
            title="6. Certifications"
            description="Add relevant courses and certifications."
          >
            {form.certifications.map((item, index) => (
              <div
                key={index}
                className="mb-4 rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">
                    Certification {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeArrayItem("certifications", index)
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Certification Name</label>
                    <input
                      className={inputClass}
                      value={item.name}
                      onChange={(e) =>
                        updateArrayItem(
                          "certifications",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Course or certificate"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Issuing Organization</label>
                    <input
                      className={inputClass}
                      value={item.issuer}
                      onChange={(e) =>
                        updateArrayItem(
                          "certifications",
                          index,
                          "issuer",
                          e.target.value
                        )
                      }
                      placeholder="Organization"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Year</label>
                    <input
                      className={inputClass}
                      type="number"
                      min="1950"
                      max="2100"
                      value={item.year}
                      onChange={(e) =>
                        updateArrayItem(
                          "certifications",
                          index,
                          "year",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 2026"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem("certifications")}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              + Add Certification
            </button>
          </Section>

          {/* 7. Career preferences */}
          <Section
            title="7. Career Preferences"
            description="Help RADIX understand the opportunities you are looking for."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Preferred Job Roles</label>
                <input
                  className={inputClass}
                  value={form.preferredRoles}
                  onChange={(e) =>
                    updateField("preferredRoles", e.target.value)
                  }
                  placeholder="Data Analyst, Python Developer..."
                />
              </div>

              <div>
                <label className={labelClass}>Preferred Locations</label>
                <input
                  className={inputClass}
                  value={form.preferredLocations}
                  onChange={(e) =>
                    updateField("preferredLocations", e.target.value)
                  }
                  placeholder="Noida, Delhi, Remote..."
                />
              </div>

              <div>
                <label className={labelClass}>Employment Type</label>
                <select
                  className={inputClass}
                  value={form.employmentType}
                  onChange={(e) =>
                    updateField("employmentType", e.target.value)
                  }
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Experience Level</label>
                <select
                  className={inputClass}
                  value={form.experienceLevel}
                  onChange={(e) =>
                    updateField("experienceLevel", e.target.value)
                  }
                >
                  <option>Fresher</option>
                  <option>Entry-level</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
            </div>
          </Section>

          {/* 8. Professional links */}
          <Section
            title="8. Professional Links"
            description="Optional links to your professional work."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => updateField("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className={labelClass}>GitHub URL</label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => updateField("githubUrl", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Portfolio URL</label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => updateField("portfolioUrl", e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </Section>

          {/* Submit */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setMessage("");
              }}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            >
              Validate Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
