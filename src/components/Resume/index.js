import React, { forwardRef, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Checkbox } from "antd";
import {
  CalendarOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  DownloadOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useLogoutMutation } from "../../api/loginApi";
import { useCompleteProfileMutation } from "../../api/profileApi";
import { logout } from "../../api/store/authSlice";
import joshImage from "../../assets/josh-black-logo.png";
import {
  ADMIN,
  getMonthString,
  PRESENT_VALUE,
  PROFILE_LIST_ROUTE,
  ROOT_ROUTE,
  SUCCESS_TOASTER,
} from "../../Constants";
import { calculateTotalExperience, showConfirm } from "../../helpers";
import styles from "./Resume.module.css";

const Resume = forwardRef(({ data }, ref) => {
  const [logoutService] = useLogoutMutation();
  const role = useSelector((state) => state.auth.role);
  const email = useSelector((state) => state.auth.email);
  const [completeProfileService] = useCompleteProfileMutation();
  const [contactDetails, setContactDetails] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { is_josh_employee } = location.state || {};

  Resume.propTypes = {
    data: PropTypes.object.isRequired,
  };
  const {
    profileData: profile,
    projectData: projects,
    experienceData: experiences,
    educationData: educations,
    achievementData: achievements,
    certificationData: certifications,
  } = data;

  const containerRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const getMonthYear = (value) => {
    if (!value) {
      return;
    }
    const date = new Date(value);
    const currDate = new Date();

    const givenYear = date.getFullYear();
    const givenMonth = date.getMonth();

    if (
      givenYear === currDate.getFullYear() &&
      givenMonth === currDate.getMonth()
    ) {
      return "Present";
    }
    return `${getMonthString(givenMonth)} ${givenYear}`;
  };

  const sectionDiv = {
    experiences: (
      <div
        key={"experiences"}
        className={`${styles.section} pb-2 ${
          experiences?.length > 0 ? "" : styles.hidden
        } `}
      >
        <div className={styles.sectionTitle}>Experiences</div>
        <div className={styles.content}>
          <div className={`${styles.partionedItems}`}>
            {experiences?.map((item) => (
              <div
                className={`${styles.educationItem} ${styles.avoidBreak}`}
                key={item.id}
              >
                {item?.designation && (
                  <div
                    className={`${styles.subtitleHeading} ${styles.customHeading}`}
                  >
                    {item.designation}
                  </div>
                )}
                {item?.company_name && (
                  <>
                    <span className={styles.subtitle}>{item.company_name}</span>
                    <div className={styles.date}>
                      <CalendarOutlined />
                      {getMonthYear(item.from_date)} -{" "}
                      {item.to_date === PRESENT_VALUE
                        ? "Present"
                        : getMonthYear(item.to_date)}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    projects: (
      <div
        key={"projects"}
        className={`${styles.section} pb-3 ${
          projects?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.sectionTitle}>Projects</div>
        <div className={styles.content}>
          {projects?.map((item) => (
            <div className={styles.educationItem} key={item.id}>
              <div className={styles.avoidBreak}>
                {item?.name && (
                  <div>
                    <p
                      className={`${styles.subtitleHeading} ${styles.customHeading}`}
                    >
                      {item.name}
                    </p>
                  </div>
                )}
                {item?.working_start_date && item?.working_end_date && (
                  <p className={styles.customSubHeading}>
                    <CalendarOutlined /> {getMonthYear(item.working_start_date)}{" "}
                    -{" "}
                    {getMonthYear(item.working_end_date) === PRESENT_VALUE
                      ? "Present"
                      : getMonthYear(item.working_end_date)}
                  </p>
                )}
                {item?.duration && (
                  <div className={styles.blury}>
                    Duration: {item.duration} years
                  </div>
                )}
              </div>
              {item?.description && (
                <div className={styles.avoidBreak}>
                  <span className={styles.duration}>
                    <b className={styles.overview}>Project Description: </b>
                    <span style={{ whiteSpace: "pre-line" }}>
                      {item.description}
                    </span>
                  </span>
                </div>
              )}
              {item?.role && (
                <div className={styles.avoidBreak}>
                  <span className={styles.duration}>
                    <b className={styles.overview}>Role: </b>
                    {item.role}
                  </span>
                </div>
              )}
              {item?.responsibilities && (
                <div className={styles.avoidBreak}>
                  <span className={styles.duration}>
                    <b className={styles.overview}>Responsibility: </b>
                    <ul>
                      {item.responsibilities.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </span>
                </div>
              )}
              {item?.technologies && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Project Techstack: </b>
                  {Array.isArray(item.technologies)
                    ? item.technologies.join(", ")
                    : item.technologies}
                </span>
              )}
              {item?.tech_worked_on && (
                <span className={styles.duration}>
                  <b className={styles.overview}>Technology Worked On: </b>
                  {Array.isArray(item.tech_worked_on)
                    ? item.tech_worked_on.join(", ")
                    : item.tech_worked_on}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    achievements: (
      <div
        key={"achievements"}
        className={`${styles.section} ${
          achievements?.length > 0 ? "" : styles.hidden
        }`}
      >
        {/* <div className={styles.separate}></div> */}
        <div className={styles.sectionTitle}>Achievements</div>
        <div className={`${styles.content}`}>
          {achievements?.map((item) => (
            <div className={styles.avoidBreak} key={item?.name}>
              {item?.name && (
                <p
                  className={`${styles.subtitleHeading} ${styles.customHeading}`}
                >
                  {item.name}
                </p>
              )}
              {item?.description && <p>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ),
    educations: (
      <div
        key={"education"}
        className={`${styles.section} pb-2 ${
          educations?.length > 0 ? "" : styles.hidden
        } `}
      >
        <div className={`${styles.sectionTitle}`}>Education</div>
        <div className={styles.content}>
          <div className={`${styles.partionedItems} ${styles.avoidBreak}`}>
            {educations?.map((item) => (
              <div className={styles.educationItem} key={item.id}>
                {item?.degree && (
                  <p
                    className={`${styles.subtitleHeading} ${styles.customHeading}`}
                  >
                    {item.degree}
                  </p>
                )}
                {(item?.university_name || item?.place) && (
                  <div className={styles.subtitle}>
                    {item.university_name}
                    {item.place && `, ${item.place}`}
                  </div>
                )}
                {item?.passing_year && (
                  <div className={styles.passingDate}>
                    <div className={styles.subtitle}>Passing Year:</div>{" "}
                    {item.passing_year}
                  </div>
                )}
                {item?.percent_or_cgpa && (
                  <div className={styles.passingDate}>
                    <div className={styles.subtitle}>Score:</div>{" "}
                    {item.percent_or_cgpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    skills: (
      <div
        key={"skills"}
        className={`${styles.section} ${
          profile?.primary_skills?.length > 0 ? "" : styles.hidden
        }`}
      >
        {profile && (
          <>
            <div className={styles.sectionTitle}>Skills</div>
            <div className={styles.skillSection}>
              {profile?.primary_skills?.length > 0 && (
                <div>
                  <b>Primary:</b>{" "}
                  {Array.isArray(profile?.primary_skills)
                    ? profile?.primary_skills.join(", ")
                    : profile?.primary_skills}
                </div>
              )}
              {profile?.secondary_skills?.length > 0 && (
                <div>
                  <b>Secondary:</b>{" "}
                  {Array.isArray(profile?.secondary_skills)
                    ? profile?.secondary_skills.join(", ")
                    : profile?.secondary_skills}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    ),
    certifications: (
      <div
        key={"certifications"}
        className={`${styles.section} ${
          certifications?.length > 0 ? "" : styles.hidden
        }`}
      >
        <div className={styles.sectionTitle}>Certifications</div>
        <div className={styles.content}>
          {certifications?.map((item) => (
            <div
              className={`${styles.educationItem} ${styles.avoidBreak}`}
              key={item.id}
            >
              {item?.name && (
                <>
                  <div className={styles.date}>
                    <p
                      className={`${styles.subtitleHeading} ${styles.customHeading}`}
                    >
                      {item.name}
                    </p>
                  </div>
                </>
              )}
              {item?.organization_name && (
                <div className={styles.date}>
                  <b>Issued By: </b>
                  {item.organization_name}
                </div>
              )}
              {item?.issued_date && (
                <div className={styles.passingDate}>
                  <b>Issued On: </b> {item.issued_date}
                </div>
              )}
              {item?.description && <div>{item.description}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
  };

  //Whenever active colour changes from Body component then this effect will be called.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const color = is_josh_employee === "NO" ? "#062e38" : "#35549c";
    container.style.setProperty("--color", color);
  }, [is_josh_employee]);

  const getPageMargins = () => {
    return `@page { margin: ${"1rem"} ${"0"} ${"1rem"} ${"0"} !important }`;
  };

  const showCompleteProfileButton =
    role.toLowerCase() === ADMIN &&
    email === profile?.email &&
    profile?.is_invited === "YES";

  const handleCompleteProfile = () => {
    showConfirm({
      onOk: async () => {
        try {
          if (profile?.id) {
            const response = await completeProfileService({
              profile_id: profile?.id,
            });

            if (response?.data) {
              toast.success(response?.data?.message, SUCCESS_TOASTER);
              if (role.toLowerCase() === ADMIN) {
                navigate(PROFILE_LIST_ROUTE);
              } else {
                await logoutService();
                dispatch(logout());
                window.localStorage.clear();
                navigate(ROOT_ROUTE);
              }
            }
          }
        } catch (error) {
          toast.error(error.response?.data?.error_message);
        }
      },
      onCancel() {},
      message:
        role.toLowerCase() === ADMIN
          ? "Are you sure you want to finalize the profile?"
          : "Are you sure you want to finalize the profile? once marked as completed, you won't be able to login or modify!",
    });
  };

  return (
    <>
      <div
        className={styles.headerMenu}
        style={{ marginTop: "10px", marginLeft: "20px" }}
      >
        {role.toLowerCase() === ADMIN ? (
          <>
            {showCompleteProfileButton && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{ background: "#e34435", color: "white" }}
                onClick={handleCompleteProfile}
              >
                Complete Profile
              </Button>
            )}
            <Button
              icon={<DownloadOutlined />}
              style={{ background: "#e34435", color: "white" }}
              onClick={handlePrint}
            >
              Download
            </Button>
            <div style={{ marginTop: "6px" }}>
              <Checkbox onChange={() => setContactDetails(!contactDetails)} />{" "}
              Do you want hide contact details ?
            </div>
          </>
        ) : (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            style={{ background: "#e34435", color: "white" }}
            onClick={handleCompleteProfile}
          >
            Complete Profile
          </Button>
        )}
      </div>
      <div ref={ref} className={styles.main}>
        <style>{getPageMargins()}</style>
        <div ref={containerRef} className={styles.containerWrapper}>
          <div>
            <div className={styles.container}>
              <div className={styles.employeeInfo}>
                <p className={styles.nameStyle}>{profile?.name}</p>
                <div className={styles.designation}>
                  {profile?.designation && <span>{profile?.designation}</span>}
                  {profile?.gender && (
                    <span className="px-1">({profile?.gender})</span>
                  )}
                </div>
                <div>
                  {(profile?.years_of_experience ||
                    profile?.josh_joining_date?.String) &&
                    (() => {
                      const years = calculateTotalExperience(
                        profile?.years_of_experience,
                        profile?.josh_joining_date?.String,
                      );

                      if (years === 0) {
                        return null;
                      }

                      return (
                        <div className={styles.iconTextWrapper}>
                          <CheckSquareOutlined />{" "}
                          <span>
                            {years < 1
                              ? `${Math.floor(years * 12)} Months of Experience`
                              : `${years} Year${years > 1 ? "s" : ""} of Experience`}{" "}
                          </span>
                        </div>
                      );
                    })()}

                  {profile?.email && contactDetails && (
                    <div className={styles.iconTextWrapper}>
                      <MailOutlined /> <span>{profile?.email}</span>
                    </div>
                  )}
                  {profile?.mobile && contactDetails && (
                    <div className={styles.iconTextWrapper}>
                      <MobileOutlined /> <span>{profile?.mobile}</span>
                    </div>
                  )}
                  <div className={styles.socialLink}>
                    {profile?.github_link && (
                      <div className={styles.iconTextWrapper}>
                        <GithubOutlined />{" "}
                        <Link
                          className={styles.customLink}
                          target="_blank"
                          to={profile?.github_link}
                        >
                          GitHub
                        </Link>
                      </div>
                    )}
                    {profile?.linkedin_link && (
                      <div className={styles.iconTextWrapper}>
                        <LinkedinOutlined />
                        {"  "}
                        <Link
                          className={styles.customLink}
                          target="_blank"
                          to={profile?.linkedin_link}
                        >
                          LinkedIn
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.flexCenter}>
                <img src={joshImage} alt="Not Found" className={styles.logo} />
              </div>
            </div>
          </div>

          <div>
            <div>
              {profile?.description && (
                <div>
                  <div>
                    <div className={styles.sectionTitle}>Profile</div>
                  </div>
                  <div className={`${styles.profiledetails} `}>
                    <span style={{ whiteSpace: "pre-line" }}>
                      {profile?.description}
                    </span>
                  </div>
                </div>
              )}
              {sectionDiv.skills}
              {sectionDiv.educations}
              {sectionDiv.experiences}
              {sectionDiv.projects}
              {sectionDiv.certifications}
              {sectionDiv.achievements}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Resume.displayName = "Resume";
export default Resume;
