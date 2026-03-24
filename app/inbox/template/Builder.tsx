"use client"
import React, { useState, useRef, useEffect } from "react";
import { Box } from '@chakra-ui/react'
import { Button, Input, Select, Card, Typography, Dropdown, Space, Row, Col, Upload, message } from "antd";
import { PlusOutlined, GlobalOutlined, PhoneOutlined, WhatsAppOutlined, CopyOutlined, FileTextOutlined, EnvironmentOutlined, VideoCameraOutlined, PictureOutlined, DownOutlined, BoldOutlined, ItalicOutlined, StrikethroughOutlined, CodeOutlined, InfoCircleOutlined, CloseOutlined, PlayCircleOutlined } from "@ant-design/icons";
import useAxios from "@/lib/http/useAxios";
import PopUp from "./PopUp";
import { useRouter } from "next/navigation";
import { API_BASE_URL, AUTH_COOKIE_KEY } from "@/lib/config";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ButtonType {
  id: number;
  type: string;
  text: string;
  url: string;
  country: string;
  phone: string;
  offerCode?: string;
}

interface ButtonOption {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface categorytype {
  category: any;
}

// ✅ language display name → locale code the backend/Meta expects
const LANGUAGE_MAP: Record<string, string> = {
  "English": "en_US",
  "Hindi": "hi",
  "Tamil": "ta",
  "Telugu": "te",
  "Arabic": "ar",
};

// ✅ Read cookie by name — same source useAxios uses (AUTH_COOKIE_KEY)
const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
};

const TemplateBuilder = ({ category }: categorytype) => {
  const router = useRouter()
  const [request] = useAxios<any>({ endpoint: "CREATETEMPLATE", successCb() { router.back() } });
  const [templateName, setTemplateName] = useState<string>("your_template_name");
  const [language, setLanguage] = useState<string>("English");
  const [bodyText, setBodyText] = useState<string>("Hello");
  const [footer, setFooter] = useState<string>("");
  const [variableType, setVariableType] = useState<string>("Number");
  const [mediaSample, setMediaSample] = useState<string>("Text");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [headerText, setHeaderText] = useState<string>("");
  const [buttons, setButtons] = useState<ButtonType[]>([]);
  const [showButtonForm, setShowButtonForm] = useState<boolean>(false);

  const textAreaRef = useRef<any>(null);

  // Button form states
  const [buttonType, setButtonType] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("");
  const [buttonUrl, setButtonUrl] = useState<string>("");
  const [buttonCountry, setButtonCountry] = useState<string>("US +1");
  const [buttonPhone, setButtonPhone] = useState<string>("");
  const [offerCode, setOfferCode] = useState<string>("");

  const [popup, setPopup] = useState<boolean>(false);
  const [variableData, setVariableData] = useState<any>(null);
  // ✅ call = true means "API should fire now"
  const [call, setCall] = useState<boolean>(false);

  const getVarCount = (text: string) => (text.match(/\{\{\d+\}\}/g) || []).length;

  const renumber = (text: string): string => {
    let i = 0;
    return text.replace(/\{\{\d+\}\}/g, () => `{{${++i}}}`);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const renumbered = renumber(e.target.value);
    setBodyText(renumbered);
  };

  const addVariable = () => {
    const currentCount = getVarCount(bodyText);
    const nextVar = `{{${currentCount + 1}}}`;
    const textarea = textAreaRef.current?.resizableTextArea?.textArea;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = bodyText.substring(0, start) + nextVar + bodyText.substring(end);
      setBodyText(newText);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + nextVar.length;
        textarea.focus();
      }, 0);
    } else {
      setBodyText((prev) => prev + nextVar);
    }
  };

  const handleMediaChange = (value: string) => {
    setMediaSample(value);
    if (value === "Text") {
      setMediaPreview(null);
      setMediaFile(null);
    } else {
      setMediaPreview(null);
    }
  };

  // ✅ FIX: Split into beforeUpload (just return false to stop auto-upload)
  //         and onChange (where originFileObj is reliably available)
  //         Previously both were the same function → file was never captured properly
  const beforeUpload = () => {
    // Returning false prevents Ant Design from auto-uploading
    return false;
  };

  const handleFileUpload = (info: any) => {
    // ✅ originFileObj is the real browser File object — only reliably set in onChange
    const file: File = info.file.originFileObj ?? info.file;

    if (!file || typeof file.name === "undefined") return;

    if (mediaSample === "Image" || mediaSample === "Video") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setMediaPreview(e.target.result as string);
          setMediaFile(file);
        }
      };
      reader.readAsDataURL(file);
    } else if (mediaSample === "Document") {
      setMediaFile(file);
      setMediaPreview(file.name);
    }
  };

  const handleButtonSelect = (type: string) => {
    setButtonType(type);
    setShowButtonForm(true);
    setButtonText("");
    setButtonUrl("");
    setButtonPhone("");
    setOfferCode("");
    const defaultTexts: Record<string, string> = {
      URL: "Custom",
      website: "Visit website",
      whatsapp: "Call on WhatsApp",
      PHONE_NUMBER: "Call phone number",
      FLOW: "Complete flow",
      PAYMENT_REQUEST: "Copy offer code"
    };
    setButtonText(defaultTexts[type] || "");
  };

  const addButton = () => {
    if (!buttonText.trim()) { message.error("Please enter button text"); return; }
    if (buttonType === "PHONE_NUMBER" && !buttonPhone) { message.error("Please enter a phone number"); return; }
    if (buttonType === "PAYMENT_REQUEST" && !offerCode) { message.error("Please enter an offer code"); return; }
    const newButton: ButtonType = {
      id: Date.now(), type: buttonType, text: buttonText,
      url: buttonUrl, country: buttonCountry, phone: buttonPhone, offerCode: offerCode
    };
    setButtons([...buttons, newButton]);
    setShowButtonForm(false);
    resetButtonForm();
  };

  const resetButtonForm = () => {
    setButtonType(""); setButtonText(""); setButtonUrl(""); setButtonPhone(""); setOfferCode("");
  };

  const removeButton = (id: number) => {
    setButtons(buttons.filter(btn => btn.id !== id));
  };

  // ✅ Extracted API call logic into its own function
  const callApi = async (varData: any) => {
    const components: any[] = [];

    if (mediaSample === "Text") {
      if (headerText) {
        components.push({ type: "HEADER", format: "TEXT", text: headerText });
      }
    } else if (mediaSample === "Location") {
      components.push({ type: "HEADER", format: "LOCATION" });
    } else {
      if (mediaFile) {
        components.push({
          type: "HEADER",
          format: mediaSample.toUpperCase(),
        });
      }
    }

    const bodyVariables = getVarCount(bodyText);
    const bodyComponent: any = { type: "BODY", text: bodyText };

    if (bodyVariables > 0) {
      // ✅ Use actual variable sample values from popup if available, else "sample_text"
      const sampleValues = varData
        ? Object.values(varData).map((v: any) => v || "sample_text")
        : Array(bodyVariables).fill("sample_text");
      bodyComponent.example = { body_text: [sampleValues] };
    }

    components.push(bodyComponent);

    if (footer) { components.push({ type: "FOOTER", text: footer }); }

    if (buttons.length > 0) {
      const buttonComponents = buttons.map(btn => {
        if (btn.type === "PHONE_NUMBER" || btn.type === "VOICE_CALL") {
          return { type: "PHONE_NUMBER", text: btn.text, phone_number: btn.phone };
        } else if (btn.type === "URL") {
          return { type: "URL", text: btn.text, url: btn.url };
        } else if (btn.type === "PAYMENT_REQUEST") {
          return { type: "PAYMENT_REQUEST", example: [btn.offerCode] };
        } else if (btn.type === "FLOW") {
          return { type: "FLOW", text: btn.text, flow_id: "<FLOW_ID>", flow_action: "navigate" };
        }
        return null;
      }).filter(Boolean);
      components.push({ type: "BUTTONS", buttons: buttonComponents });
    }

    // ✅ "English" → "en_US"  (backend & Meta expect locale code, not display name)
    const resolvedLanguage = LANGUAGE_MAP[language] ?? "en_US";

    const payloadObject = {
      name: templateName.toLowerCase().replace(/\s+/g, '_'),
      category: category,
      language: resolvedLanguage,
      components: components,
      bodyText: bodyText,
      footer: footer,
      headerType: mediaSample.toUpperCase(),
      headerText: headerText,
      variablecount: bodyVariables || 0,
      buttons: buttons.map(btn => ({
        ...btn,
        value: btn.url,           // ✅ backend reads "value" not "url"
        phone_number: btn.phone   // ✅ backend reads "phone_number" not "phone"
      }))
    };
    console.log("------------------", payloadObject, "--------------")
    if (mediaFile && ["Image", "Video", "Document"].includes(mediaSample)) {
      /*
       * ✅ WHY native fetch instead of useAxios:
       *    useAxios passes data through axios which JSON.stringify's it.
       *    JSON.stringify(File) → {} (empty object) → backend crashes.
       *
       *    Native fetch with a real FormData body sends binary file bytes.
       *    DO NOT set Content-Type — browser must set it with the boundary.
       *
       * ✅ WHY getCookie(AUTH_COOKIE_KEY):
       *    useAxios reads auth from cookie (AUTH_COOKIE_KEY), not localStorage.
       *    We must do the same for the native fetch Authorization header.
       */
      const formData = new FormData();

      // ✅ Append real File object — binary bytes preserved
      formData.append("headerHandle", mediaFile, mediaFile.name);

      // ✅ All string fields — match working curl --form keys exactly
      formData.append("name", payloadObject.name);
      formData.append("category", payloadObject.category);
      formData.append("language", payloadObject.language);
      formData.append("headerType", payloadObject.headerType);
      formData.append("bodyText", payloadObject.bodyText);
      formData.append("footer", payloadObject.footer);
      formData.append("headerText", payloadObject.headerText);
      formData.append("variablecount", String(payloadObject.variablecount));
      formData.append("buttons", JSON.stringify(payloadObject.buttons));
      formData.append("components", JSON.stringify(payloadObject.components));

      // ✅ Debug — log all FormData entries before sending
      console.log("FormData entries:");
      formData.forEach((val, key) => {
        console.log(` ${key}:`, val instanceof File ? `File(${val.name}, ${val.size} bytes)` : val);
      });

      // ✅ Read token from cookie — same as useAxios (AUTH_COOKIE_KEY)
      const token = getCookie(AUTH_COOKIE_KEY);

      const res = await fetch(`${API_BASE_URL}/v1/createTemplate`, {
        method: "POST",
        headers: {
          // ✅ Authorization only — NO Content-Type (browser sets multipart + boundary)
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Template creation error:", err);
        message.error(err?.message ?? "Template creation failed");
        return;
      }

    } else {
      // ✅ No media file → use existing useAxios (JSON), behaviour completely unchanged
      console.log("Calling API with JSON payload:", payloadObject);
      await request({ data: payloadObject });

    }
  };

  // ✅ useEffect watches "call" state
  //    When PopUp sets call=true + variableData is set → fire the API
  useEffect(() => {
    if (call) {
      setCall(false); // reset so it doesn't fire again
      callApi(variableData);
    }
  }, [call]);

  // ✅ Generate button click handler
  const generatePayload = async () => {
    const varCount = getVarCount(bodyText);

    if (varCount > 0) {
      // ✅ Has variables → open popup, do NOT call API yet
      setPopup(true);
    } else {
      // ✅ No variables → call API directly
      await callApi(null);
    }
  };

  const buttonOptions: ButtonOption[] = [
    { key: 'URL', label: 'Custom', icon: <GlobalOutlined /> },
    { key: 'URL', label: 'Visit website', icon: <GlobalOutlined /> },
    { key: 'VOICE_CALL', label: 'Call on WhatsApp', icon: <WhatsAppOutlined /> },
    { key: 'PHONE_NUMBER', label: 'Call Phone Number', icon: <PhoneOutlined /> },
    { key: 'FLOW', label: 'Complete flow', icon: <FileTextOutlined /> },
    { key: 'PAYMENT_REQUEST', label: 'PAYMENT REQUEST', icon: <CopyOutlined /> },
  ];

  const getButtonIcon = (type: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      URL: <GlobalOutlined />,
      website: <GlobalOutlined />,
      whatsapp: <PhoneOutlined />,
      PHONE_NUMBER: <PhoneOutlined />,
      FLOW: <FileTextOutlined />,
      PAYMENT_REQUEST: <CopyOutlined />
    };
    return icons[type] || <GlobalOutlined />;
  };

  return (
    <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Progress Steps */}
      <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "20px" }}>
        <Space align="center">
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#1b9c85", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>✓</div>
          <Text strong style={{ color: "#1b9c85" }}>Set up template</Text>
        </Space>
        <Space align="center">
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>2</div>
          <Text strong style={{ color: "#1877f2" }}>Edit template</Text>
        </Space>
        <Space align="center">
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #d0d5dd", display: "flex", alignItems: "center", justifyContent: "center", color: "#98a2b3" }}>3</div>
          <Text style={{ color: "#98a2b3" }}>Submit for Review</Text>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Template Header */}
            <Card style={{ borderRadius: "8px" }}>
              <Space align="start" size="middle">
                <div style={{ width: "60px", height: "60px", background: "#1b9c85", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px" }}>📢</div>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{templateName || "your_template_name"} • {language}</Title>
                  <Text type="secondary">{category} • Default</Text>
                </div>
              </Space>
            </Card>

            {/* Template Name and Language */}
            <Card title="Template name and language" style={{ borderRadius: "8px" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <Text strong>Name your template</Text>
                    <Input placeholder="Enter a template name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} maxLength={512} showCount style={{ marginTop: 8 }} />
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>Select language</Text>
                    <Select value={language} onChange={setLanguage} style={{ width: "100%", marginTop: 8 }} suffixIcon={<DownOutlined />}>
                      <Select.Option value="English">English</Select.Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Content */}
            <Card title="Content" style={{ borderRadius: "8px" }}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  Add a header, body and footer for your template. Cloud API hosted by Meta will review the template variables and content to protect the security and integrity of our services. <a href="#">Learn more</a>
                </Text>

                {/* Variable Type */}
                <div>
                  <Space>
                    <Text strong>Type of variable</Text>
                    <InfoCircleOutlined style={{ color: "#98a2b3" }} />
                  </Space>
                  <Select value={variableType} onChange={setVariableType} style={{ width: "100%", marginTop: 8 }} suffixIcon={<DownOutlined />}>
                    <Select.Option value="Name">Name</Select.Option>
                    <Select.Option value="Number">Number</Select.Option>
                  </Select>
                </div>

                {/* Media Sample */}
                <div>
                  <Text strong>Media sample</Text>
                  <Text type="secondary"> • Optional</Text>
                  <Select value={mediaSample} onChange={handleMediaChange} style={{ width: "100%", marginTop: 8 }} suffixIcon={<DownOutlined />}>
                    <Select.Option value="Text">Text</Select.Option>
                    <Select.Option value="Image"><Space><PictureOutlined /> Image</Space></Select.Option>
                    <Select.Option value="Video"><Space><VideoCameraOutlined /> Video</Space></Select.Option>
                    <Select.Option value="Document"><Space><FileTextOutlined /> Document</Space></Select.Option>
                    <Select.Option value="Location"><Space><EnvironmentOutlined /> Location</Space></Select.Option>
                  </Select>

                  {(mediaSample === "Image" || mediaSample === "Video" || mediaSample === "Document") && (
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                      {/*
                       * ✅ FIX: beforeUpload returns false (stops auto-upload)
                       *         onChange fires after user picks file — originFileObj is reliable here
                       *         Previously same fn on both props caused double-fire + empty file
                       */}
                      <Upload
                        accept={
                          mediaSample === "Image" ? "image/*" :
                            mediaSample === "Video" ? "video/*" :
                              ".pdf,.doc,.docx"
                        }
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleFileUpload}
                      >
                        <Button icon={<PlusOutlined />}>
                          {mediaFile ? `✓ ${mediaFile.name}` : `Upload ${mediaSample}`}
                        </Button>
                      </Upload>
                    </div>
                  )}
                </div>

                {/* Header */}
                {mediaSample === "Text" && (
                  <div>
                    <Text strong>Header</Text>
                    <Text type="secondary"> • Optional</Text>
                    <Input placeholder="Enter header text" value={headerText} onChange={(e) => setHeaderText(e.target.value)} maxLength={60} showCount style={{ marginTop: 8 }} />
                  </div>
                )}

                {/* Body */}
                <div>
                  <Text strong>Body</Text>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ border: "1px solid #d0d5dd", borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{ padding: "8px 12px", borderBottom: "1px solid #d0d5dd", display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb" }}>
                        <Button size="small" icon={<BoldOutlined />} type="text" />
                        <Button size="small" icon={<ItalicOutlined />} type="text" />
                        <Button size="small" icon={<StrikethroughOutlined />} type="text" />
                        <Button size="small" icon={<CodeOutlined />} type="text" />
                        <div style={{ width: 1, height: 20, background: "#d0d5dd", margin: "0 4px" }} />
                        <Button size="small" type="text" onClick={addVariable}><PlusOutlined /> Add variable</Button>
                        <InfoCircleOutlined style={{ color: "#98a2b3", marginLeft: "auto" }} />
                      </div>
                      <TextArea ref={textAreaRef} value={bodyText} onChange={handleBodyChange} placeholder="Enter message body" maxLength={1024} showCount bordered={false} style={{ resize: "none" }} rows={4} />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div>
                  <Text strong>Footer</Text>
                  <Text type="secondary"> • Optional</Text>
                  <Input placeholder="Add a short line of text to the bottom of your message in English" value={footer} onChange={(e) => setFooter(e.target.value)} maxLength={60} showCount style={{ marginTop: 8 }} />
                </div>

                {/* Buttons Section */}
                <div style={{ marginTop: 24 }}>
                  <Text strong>Buttons</Text>
                  <Text type="secondary"> • Optional</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: "13px", display: "block", marginBottom: 12 }}>
                      Create buttons that let customers respond to your message or take action. You can add up to ten buttons. If you add more than three buttons, they will appear in a list.
                    </Text>
                    {buttons.map((btn) => (
                      <Card key={btn.id} size="small" style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Space>{getButtonIcon(btn.type)}<Text>{btn.text}</Text></Space>
                          <CloseOutlined onClick={() => removeButton(btn.id)} style={{ cursor: "pointer" }} />
                        </div>
                      </Card>
                    ))}
                    <Dropdown
                      menu={{ items: buttonOptions.map(opt => ({ key: opt.key, label: <Space>{opt.icon} {opt.label}</Space>, onClick: () => handleButtonSelect(opt.key) })) }}
                      trigger={['click']}
                    >
                      <Button><PlusOutlined /> Add button <DownOutlined /></Button>
                    </Dropdown>
                  </div>
                </div>

                {/* Button Configuration Form */}
                {showButtonForm && (
                  <Card title="Call to action • Optional" size="small" style={{ marginTop: 16 }}>
                    <Space direction="vertical" style={{ width: "100%" }} size="middle">
                      <Row gutter={16}>
                        <Col span={buttonType === "PHONE_NUMBER" ? 6 : buttonType === "PAYMENT_REQUEST" ? 12 : 8}>
                          <Text strong>Type of action</Text>
                          <Select value={buttonType} style={{ width: "100%", marginTop: 8 }} disabled>
                            <Select.Option value={buttonType}>{buttonOptions.find(opt => opt.key === buttonType)?.label}</Select.Option>
                          </Select>
                        </Col>
                        <Col span={buttonType === "PHONE_NUMBER" ? 6 : buttonType === "PAYMENT_REQUEST" ? 12 : 16}>
                          <Text strong>Button text</Text>
                          <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} maxLength={25} showCount style={{ marginTop: 8 }} placeholder="Button text" />
                        </Col>
                        {buttonType === "PHONE_NUMBER" && (
                          <>
                            <Col span={6}>
                              <Text strong>Country</Text>
                              <Select value={buttonCountry} onChange={setButtonCountry} style={{ width: "100%", marginTop: 8 }}>
                                <Select.Option value="US +1">US +1</Select.Option>
                                <Select.Option value="IN +91">IN +91</Select.Option>
                              </Select>
                            </Col>
                            <Col span={6}>
                              <Text strong>Phone number</Text>
                              <Input value={buttonPhone} onChange={(e) => setButtonPhone(e.target.value)} maxLength={20} showCount style={{ marginTop: 8 }} placeholder="Phone number" status={!buttonPhone ? "error" : ""} />
                              {!buttonPhone && <Text type="danger" style={{ fontSize: 12 }}>You need to enter a phone number.</Text>}
                            </Col>
                          </>
                        )}
                        {buttonType === "URL" && (
                          <Col span={8}>
                            <Text strong>URL</Text>
                            <Input value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} style={{ marginTop: 8 }} placeholder="https://example.com" />
                          </Col>
                        )}
                        {buttonType === "PAYMENT_REQUEST" && (
                          <Col span={24}>
                            <Text strong>Offer code</Text>
                            <Input value={offerCode} onChange={(e) => setOfferCode(e.target.value)} style={{ marginTop: 8 }} placeholder="Enter offer code" maxLength={15} showCount />
                          </Col>
                        )}
                      </Row>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={() => { setShowButtonForm(false); resetButtonForm(); }}>Cancel</Button>
                        <Button type="primary" onClick={addButton}>Add</Button>
                      </div>
                    </Space>
                  </Card>
                )}

                {/* Generate Button */}
                <div style={{ marginTop: 24, textAlign: "center" }}>
                  <Button type="primary" size="large" onClick={generatePayload}>Generate</Button>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>

        {/* Preview */}
        <Col xs={24} lg={8}>
          <div style={{ position: "sticky", top: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>Template preview</Title>
              <Button icon={<PlayCircleOutlined />} type="text" />
            </div>
            <div style={{ background: "#e5ddd5", backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", padding: "20px", borderRadius: "10px", minHeight: "500px", display: "flex", flexDirection: "column" }}>
              {/* <div style={{ background: "white", borderRadius: "7.5px", maxWidth: "85%", boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)", overflow: "hidden" }}>
                {mediaPreview && mediaSample === "Image" && (<img src={mediaPreview} alt="preview" style={{ width: "100%", display: "block" }} />)}
                {mediaPreview && mediaSample === "Video" && (<video src={mediaPreview} style={{ width: "100%", display: "block", maxHeight: 200 }} controls />)}
                {mediaPreview && mediaSample === "Document" && (
                  <div style={{ padding: "15px", background: "#f0f2f5", display: "flex", alignItems: "center", gap: 10 }}>
                    <FileTextOutlined style={{ fontSize: 24, color: "#667781" }} />
                    <Text style={{ fontSize: 13 }}>{mediaPreview}</Text>
                  </div>
                )}
                {mediaSample === "Location" && (
                  <div style={{ padding: "15px", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 100 }}>
                    <EnvironmentOutlined style={{ fontSize: 32, color: "#667781" }} />
                    <Text style={{ fontSize: 14 }}>Location</Text>
                  </div>
                )}
                {mediaSample === "Text" && headerText && (
                  <div style={{ padding: "10px 15px", borderBottom: "1px solid #e9ecef", fontWeight: 600, fontSize: "15px", color: "#111b21" }}>{headerText}</div>
                )}
                <div style={{ padding: "10px 15px" }}>
                  <div style={{ whiteSpace: "pre-wrap", fontSize: "14.2px", lineHeight: "19px", color: "#111b21" }}>{bodyText || "Your message will appear here..."}</div>
                  {footer && (<div style={{ color: "#667781", fontSize: "12px", marginTop: "8px", lineHeight: "16px" }}>{footer}</div>)}
                  <div style={{ textAlign: "right", fontSize: "11px", color: "#667781", marginTop: "4px" }}>11:45</div>
                </div>
              </div> */}
              {buttons.length > 0 && (
                <div style={{ marginTop: "8px", width: "85%" }}>
                  {buttons.map((btn, index) => (
                    <Button key={btn.id} block style={{ background: "white", color: "#027eb5", borderRadius: "7.5px", border: "none", height: "36px", fontSize: "14px", fontWeight: 500, boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)", marginBottom: index < buttons.length - 1 ? "8px" : 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      {getButtonIcon(btn.type)} {btn.text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Box>
        {popup && (
          <PopUp
            popup={popup}
            setCall={setCall}
            setPopUp={setPopup}
            variableData={variableData}
            setVariableData={setVariableData}
            count={getVarCount(bodyText)}
          />
        )}
      </Box>
    </div>
  );
};

export default TemplateBuilder;