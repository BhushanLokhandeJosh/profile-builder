import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "../../../api/profileApi";
import {
  DESIGNATION,
  EDITOR_PROFILE_ROUTE,
  GENDER,
  PROFILE_DETAILS,
  SKILLS,
  SUCCESS_TOASTER,
} from "../../../Constants";
const BasicInfo = ({ profileData }) => {
  const [createProfileService] = useCreateProfileMutation();
  const [updateProfileService] = useUpdateProfileMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (profileData) {
      form.setFieldsValue(profileData);
    }
  }, [profileData, form]);

  const onFinish = async (values) => {
    if (values.years_of_experience) {
      values.years_of_experience = parseFloat(values.years_of_experience);
    }

    try {
      let response;
      if (profileData) {
        response = await updateProfileService({
          profile_id: profileData.id,
          values,
        });
      } else {
        response = await createProfileService(values);
      }

      if (response.data?.message) {
        toast.success(response.data?.message, SUCCESS_TOASTER);
        navigate(
          EDITOR_PROFILE_ROUTE.replace(":profile_id", response.data?.profile_id)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.error_message);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="basic-info"
      onFinish={onFinish}
      initialValues={
        profileData?.profile || { profileDetails: PROFILE_DETAILS }
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Name required" }]}
          >
            <Input placeholder="First Middle Last" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email required",
              },
            ]}
          >
            <Input placeholder="example@joshsoftware.com" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: "Mobile number required" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            ]}
          >
            <Input type="tel" placeholder="Enter mobile number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender" options={GENDER} allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="years_of_experience"
            label="Years Of Experience"
            rules={[
              { required: true, message: "Experience required" },
              {
                validator: (_, value) =>
                  value <= 30 && value >= 0
                    ? Promise.resolve()
                    : Promise.reject(
                        "Experience must be a positive number and either a whole number up to 30 years."
                      ),
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter experience (e.g., 2.5, 1)"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="designation" label="Designation">
            <Select
              placeholder="Select designation"
              options={DESIGNATION}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title required" }]}
          >
            <Input placeholder="Backend Developer, Data Analyst, etc." />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="linkedin_link" label="LinkedIn Profile Link">
            <Input placeholder="Enter LinkedIn profile link" />
          </Form.Item>
        </Col>
      </Row>
      {/* <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="past_experience" label="Past Experience(in months)">
            <Input placeholder="Ex. 36, 12, etc." />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="josh_joining_date"
            label="JOSH Joining Date"
          >
            <DatePicker style={{ width: "100%" }} picker="month" />
          </Form.Item>
        </Col>
      </Row> */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="github_link" label="Github Profile Link">
            <Input placeholder="Enter GitHub profile link" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            initialValue={PROFILE_DETAILS}
            rules={[{ required: true, message: "Description required" }]}
          >
            <Input.TextArea
              maxLength={600}
              style={{ height: 120, resize: "none" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="primary_skills" label="Primary Skills">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select primary skills"
              options={SKILLS}
              rules={[
                {
                  required: true,
                  message: "At least one primary skill is required",
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="secondary_skills" label="Secondary Skills">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add secondary skills"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="career_objectives" label="Career Objectives">
            <Input.TextArea
              placeholder="Provide career objectives"
              maxLength={300}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" disabled={!!profileData}>
            Create
          </Button>
          <Button type="primary" htmlType="submit" disabled={!profileData}>
            Update
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

BasicInfo.propTypes = {
  profileData: PropTypes.shape({
    id: PropTypes.number,
    profile: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      gender: PropTypes.string,
      years_of_experience: PropTypes.number,
      designation: PropTypes.string,
      title: PropTypes.string,
      linkedin_link: PropTypes.string,
      github_link: PropTypes.string,
      description: PropTypes.string,
      primary_skills: PropTypes.array,
      secondary_skills: PropTypes.array,
      career_objectives: PropTypes.string,
    }),
  }),
};

export default BasicInfo;
