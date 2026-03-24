"use client"
import { useEffect, useState, useRef } from "react";
import {
  Typography, Flex, Button, Card, Row, Col, Input, Select,
  Space, Upload, Dropdown, message
} from "antd";
import {
  DownOutlined, PlusOutlined, InfoCircleOutlined, BoldOutlined,
  ItalicOutlined, StrikethroughOutlined, CodeOutlined, GlobalOutlined,
  WhatsAppOutlined, PhoneOutlined, FileTextOutlined, CopyOutlined,
  PictureOutlined, VideoCameraOutlined, EnvironmentOutlined,
  PlayCircleOutlined, CloseOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

import { Box } from "@chakra-ui/react";
import PopUp from "../PopUp";
import useAxios from "@/lib/http/useAxios";
import { Templates } from "@/lib/dummyData";
import { useLogin } from "@/lib/loginStore";

const { Title, Text } = Typography;
const { TextArea } = Input;

type ButtonType = {
  id: number;
  type: string;
  text: string;
  url: string;
  country: string;
  phone: string;
  offerCode: string;
};

type ButtonOption = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const Update = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>("MARKETING");

  const id = useLogin((i) => i.dummyTempId);
  const data = Templates.find((i) => i.id === id);

  const [request] = useAxios<any>({ endpoint: "CREATETEMPLATE" });

  const [templateName, setTemplateName] = useState<string>(data?.name ?? "");
  const [language, setLanguage] = useState<string>("English");
  const [bodyText, setBodyText] = useState<string>(data?.bodyText ?? "");
  const [footer, setFooter] = useState<string>(data?.footer ?? "");
  const [variableType, setVariableType] = useState<string>("Number");
  const [mediaSample, setMediaSample] = useState<string>(data?.headerType ?? "Text");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [headerText, setHeaderText] = useState<string>(data?.headerText ?? "");
  const [buttons, setButtons] = useState<ButtonType[]>([]);
  const [showButtonForm, setShowButtonForm] = useState<boolean>(false);

  const textAreaRef = useRef<any>(null);

  const [buttonType, setButtonType] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("");
  const [buttonUrl, setButtonUrl] = useState<string>("");
  const [buttonCountry, setButtonCountry] = useState<string>("US +1");
  const [buttonPhone, setButtonPhone] = useState<string>("");
  const [offerCode, setOfferCode] = useState<string>("");

  const [popup, setPopup] = useState<boolean>(false);
  const [variableData, setVariableData] = useState<any>();

  // ✅ This holds the built payload waiting for variable data before API call
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setTemplateName(data.name ?? "");
      setBodyText(data.bodyText ?? "");
      setFooter(data.footer ?? "");
      setHeaderText(data.headerText ?? "");
      setMediaSample(data.headerType ?? "Text");
      setCategory(data.category ?? "MARKETING");
    }
  }, [id]);

  // ✅ KEY FIX: When variableData is filled (user clicked Done in popup),
  // merge it into the pending payload and call the API
  useEffect(() => {
    if (variableData && pendingPayload) {
      const finalPayload = {
        ...pendingPayload,
        components: pendingPayload.components.map((comp: any) => {
          if (comp.type === "BODY" && variableData?.length > 0) {
            return {
              ...comp,
              example: {
                body_text: [variableData], // variableData = ["John", "ORDER123", ...]
              },
            };
          }
          return comp;
        }),
      };

      console.log("Final payload with variables:", finalPayload);

      request({ data: finalPayload })
        .then(() => {
          message.success("Template updated successfully!");
          setPendingPayload(null);
          setVariableData(undefined);
        })
        .catch(() => {
          message.error("Failed to update template.");
        });
    }
  }, [variableData]);

  if (!id) {
    return (
      <div style={{ padding: "20px" }}>
        <Title level={4}>No template selected.</Title>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "20px" }}>
        <Title level={4}>Template not found (ID: {id})</Title>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const getVarCount = (text: string) => (text.match(/\{\{\d+\}\}/g) || []).length;

  const renumber = (text: string): string => {
    let i = 0;
    return text.replace(/\{\{\d+\}\}/g, () => `{{${++i}}}`);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyText(renumber(e.target.value));
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
    if (value === "Text") { setMediaPreview(null); setMediaFile(null); }
    else { setMediaPreview(null); }
  };

  const handleFileUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (mediaSample === "Image" || mediaSample === "Video") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) { setMediaPreview(e.target.result as string); setMediaFile(file); }
      };
      reader.readAsDataURL(file);
    } else if (mediaSample === "Document") {
      setMediaFile(file);
      setMediaPreview(file.name);
    }
    return false;
  };

  const handleButtonSelect = (type: string) => {
    setButtonType(type);
    setShowButtonForm(true);
    setButtonText(""); setButtonUrl(""); setButtonPhone(""); setOfferCode("");
    const defaultTexts: Record<string, string> = {
      custom: "Custom", URL: "Visit website", VOICE_CALL: "Call on WhatsApp",
      PHONE_NUMBER: "Call phone number", FLOW: "Complete flow", PAYMENT_REQUEST: "Copy offer code",
    };
    setButtonText(defaultTexts[type] || "");
  };

  const addButton = () => {
    if (!buttonText.trim()) { message.error("Please enter button text"); return; }
    if (buttonType === "PHONE_NUMBER" && !buttonPhone) { message.error("Please enter a phone number"); return; }
    if (buttonType === "PAYMENT_REQUEST" && !offerCode) { message.error("Please enter an offer code"); return; }
    setButtons([...buttons, { id: Date.now(), type: buttonType, text: buttonText, url: buttonUrl, country: buttonCountry, phone: buttonPhone, offerCode }]);
    setShowButtonForm(false);
    resetButtonForm();
  };

  const resetButtonForm = () => {
    setButtonType(""); setButtonText(""); setButtonUrl(""); setButtonPhone(""); setOfferCode("");
  };

  const removeButton = (btnId: number) => setButtons(buttons.filter((btn) => btn.id !== btnId));

  // ✅ Build the payload first, then:
  //    - If variables exist → open popup, save payload to pendingPayload, wait for variableData
  //    - If no variables → call API directly
  const generatePayload = async () => {
    const components: any[] = [];

    if (mediaSample === "Text") {
      if (headerText) components.push({ type: "HEADER", format: "TEXT", text: headerText });
    } else if (mediaSample === "Location") {
      components.push({ type: "HEADER", format: "LOCATION" });
    } else if (mediaFile) {
      components.push({
        type: "HEADER",
        format: mediaSample.toUpperCase(),
        example: {
          header_handle: [
            mediaSample === "Image" ? "<IMAGE_URL>" :
              mediaSample === "Video" ? "<VIDEO_URL>" : "<DOCUMENT_URL>",
          ],
        },
      });
    }

    const bodyVariables = getVarCount(bodyText);
    const bodyComponent: any = { type: "BODY", text: bodyText };
    // Placeholder example — will be replaced with real variableData if popup is shown
    if (bodyVariables > 0) {
      bodyComponent.example = { body_text: [Array(bodyVariables).fill("sample_text")] };
    }
    components.push(bodyComponent);

    if (footer) components.push({ type: "FOOTER", text: footer });

    if (buttons.length > 0) {
      const buttonComponents = buttons.map((btn) => {
        if (btn.type === "PHONE_NUMBER" || btn.type === "VOICE_CALL")
          return { type: "PHONE_NUMBER", text: btn.text, phone_number: btn.phone };
        else if (btn.type === "URL" || btn.type === "custom")
          return { type: "URL", text: btn.text, url: btn.url };
        else if (btn.type === "PAYMENT_REQUEST")
          return { type: "PAYMENT_REQUEST", example: [btn.offerCode] };
        else if (btn.type === "FLOW")
          return { type: "FLOW", text: btn.text, flow_id: "<FLOW_ID>", flow_action: "navigate" };
        return null;
      }).filter(Boolean);
      components.push({ type: "BUTTONS", buttons: buttonComponents });
    }

    const payload = {
      name: templateName.toLowerCase().replace(/\s+/g, "_"),
      category,
      language: language.toLowerCase().substring(0, 2),
      components,
      bodyText, footer, headerType: mediaSample, headerText, buttons,
    };

    if (bodyVariables >= 1) {
      // ✅ Has variables: save payload and open popup to collect variable sample values
      setPendingPayload(payload);
      setVariableData(undefined); // reset previous variable data
      setPopup(true);
    } else {
      // ✅ No variables: call API directly
      try {
        await request({ data: payload });
        message.success("Template updated successfully!");
      } catch {
        message.error("Failed to update template.");
      }
    }
  };

  const buttonOptions: ButtonOption[] = [
    { key: "custom", label: "Custom", icon: <GlobalOutlined /> },
    { key: "URL", label: "Visit website", icon: <GlobalOutlined /> },
    { key: "VOICE_CALL", label: "Call on WhatsApp", icon: <WhatsAppOutlined /> },
    { key: "PHONE_NUMBER", label: "Call Phone Number", icon: <PhoneOutlined /> },
    { key: "FLOW", label: "Complete flow", icon: <FileTextOutlined /> },
    { key: "PAYMENT_REQUEST", label: "Payment Request", icon: <CopyOutlined /> },
  ];

  const getButtonIcon = (type: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      custom: <GlobalOutlined />, URL: <GlobalOutlined />,
      VOICE_CALL: <PhoneOutlined />, PHONE_NUMBER: <PhoneOutlined />,
      FLOW: <FileTextOutlined />, PAYMENT_REQUEST: <CopyOutlined />,
    };
    return icons[type] || <GlobalOutlined />;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ border: "1px solid #f0f0f0", padding: "24px", borderRadius: "8px", background: "#fff" }}>
        <Flex justify="space-between">
          <Title level={4}>Set up Your Template</Title>
          <Button className="bg-black! text-white!" onClick={() => router.back()}>Back</Button>
        </Flex>

        <Title level={4} className="my-8!">Select Category</Title>
        <Flex gap={10} className="mb-8!" wrap="wrap">
          {["marketing", "utility", "auth"].map((cat) => (
            <Button
              key={cat}
              type={category === cat.toUpperCase() ? "primary" : "default"}
              onClick={() => setCategory(cat.toUpperCase())}
              style={{ textTransform: "capitalize" }}
            >
              {cat === "auth" ? "Authentication" : cat}
            </Button>
          ))}
        </Flex>

        <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
          {/* Progress Steps */}
          <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "20px" }}>
            <Space align="center">
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1b9c85", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>✓</div>
              <Text strong style={{ color: "#1b9c85" }}>Set up template</Text>
            </Space>
            <Space align="center">
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12 }}>2</div>
              <Text strong style={{ color: "#1877f2" }}>Edit template</Text>
            </Space>
            <Space align="center">
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #d0d5dd", display: "flex", alignItems: "center", justifyContent: "center", color: "#98a2b3" }}>3</div>
              <Text style={{ color: "#98a2b3" }}>Submit for Review</Text>
            </Space>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card style={{ borderRadius: 8 }}>
                  <Space align="start" size="middle">
                    <div style={{ width: 60, height: 60, background: "#1b9c85", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24 }}>📢</div>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{templateName || data.name} • {language}</Title>
                      <Text type="secondary">{category} • Default</Text>
                    </div>
                  </Space>
                </Card>

                <Card title="Template name and language" style={{ borderRadius: 8 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Name your template</Text>
                      <Input placeholder="Enter a template name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} maxLength={512} showCount style={{ marginTop: 8 }} />
                    </Col>
                    <Col span={12}>
                      <Text strong>Select language</Text>
                      <Select value={language} onChange={setLanguage} style={{ width: "100%", marginTop: 8 }} suffixIcon={<DownOutlined />}>
                        <Select.Option value="English">English</Select.Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                <Card title="Content" style={{ borderRadius: 8 }}>
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Add a header, body and footer for your template. Cloud API hosted by Meta will review the template variables and content. <a href="#">Learn more</a>
                    </Text>

                    <div>
                      <Space><Text strong>Type of variable</Text><InfoCircleOutlined style={{ color: "#98a2b3" }} /></Space>
                      <Select value={variableType} onChange={setVariableType} style={{ width: "100%", marginTop: 8 }} suffixIcon={<DownOutlined />}>
                        <Select.Option value="Name">Name</Select.Option>
                        <Select.Option value="Number">Number</Select.Option>
                      </Select>
                    </div>

                    <div>
                      <Text strong>Media sample</Text><Text type="secondary"> • Optional</Text>
                      <Select value={mediaSample} onChange={handleMediaChange} style={{ width: "100%", marginTop: 8 }} suffixIcon={<DownOutlined />}>
                        <Select.Option value="Text">Text</Select.Option>
                        <Select.Option value="Image"><Space><PictureOutlined /> Image</Space></Select.Option>
                        <Select.Option value="Video"><Space><VideoCameraOutlined /> Video</Space></Select.Option>
                        <Select.Option value="Document"><Space><FileTextOutlined /> Document</Space></Select.Option>
                        <Select.Option value="Location"><Space><EnvironmentOutlined /> Location</Space></Select.Option>
                      </Select>
                      {(mediaSample === "Image" || mediaSample === "Video" || mediaSample === "Document") && (
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                          <Upload
                            accept={mediaSample === "Image" ? "image/*" : mediaSample === "Video" ? "video/*" : ".pdf,.doc,.docx"}
                            showUploadList={false} beforeUpload={handleFileUpload} onChange={handleFileUpload}
                          >
                            <Button icon={<PlusOutlined />}>Upload {mediaSample}</Button>
                          </Upload>
                        </div>
                      )}
                    </div>

                    {mediaSample === "Text" && (
                      <div>
                        <Text strong>Header</Text><Text type="secondary"> • Optional</Text>
                        <Input placeholder="Enter header text" value={headerText} onChange={(e) => setHeaderText(e.target.value)} maxLength={60} showCount style={{ marginTop: 8 }} />
                      </div>
                    )}

                    <div>
                      <Text strong>Body</Text>
                      <div style={{ marginTop: 8 }}>
                        <div style={{ border: "1px solid #d0d5dd", borderRadius: 8, overflow: "hidden" }}>
                          <div style={{ padding: "8px 12px", borderBottom: "1px solid #d0d5dd", display: "flex", alignItems: "center", gap: 8, background: "#f9fafb" }}>
                            <Button size="small" icon={<BoldOutlined />} type="text" />
                            <Button size="small" icon={<ItalicOutlined />} type="text" />
                            <Button size="small" icon={<StrikethroughOutlined />} type="text" />
                            <Button size="small" icon={<CodeOutlined />} type="text" />
                            <div style={{ width: 1, height: 20, background: "#d0d5dd", margin: "0 4px" }} />
                            <Button size="small" type="text" onClick={addVariable}><PlusOutlined /> Add variable</Button>
                            <InfoCircleOutlined style={{ color: "#98a2b3", marginLeft: "auto" }} />
                          </div>
                          <TextArea
                            ref={textAreaRef}
                            value={bodyText}
                            onChange={handleBodyChange}
                            placeholder="Enter message body"
                            maxLength={1024}
                            showCount
                            bordered={false}
                            style={{ resize: "none" }}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Text strong>Footer</Text><Text type="secondary"> • Optional</Text>
                      <Input placeholder="Add a short line of text to the bottom of your message in English" value={footer} onChange={(e) => setFooter(e.target.value)} maxLength={60} showCount style={{ marginTop: 8 }} />
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <Text strong>Buttons</Text><Text type="secondary"> • Optional</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                          Create buttons that let customers respond to your message or take action. You can add up to ten buttons.
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
                          menu={{ items: buttonOptions.map((opt) => ({ key: opt.key, label: <Space>{opt.icon} {opt.label}</Space>, onClick: () => handleButtonSelect(opt.key) })) }}
                          trigger={["click"]}
                        >
                          <Button><PlusOutlined /> Add button <DownOutlined /></Button>
                        </Dropdown>
                      </div>
                    </div>

                    {showButtonForm && (
                      <Card title="Call to action • Optional" size="small" style={{ marginTop: 16 }}>
                        <Space direction="vertical" style={{ width: "100%" }} size="middle">
                          <Row gutter={16}>
                            <Col span={buttonType === "PHONE_NUMBER" ? 6 : buttonType === "PAYMENT_REQUEST" ? 12 : 8}>
                              <Text strong>Type of action</Text>
                              <Select value={buttonType} style={{ width: "100%", marginTop: 8 }} disabled>
                                <Select.Option value={buttonType}>{buttonOptions.find((opt) => opt.key === buttonType)?.label}</Select.Option>
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
                            {(buttonType === "URL" || buttonType === "custom") && (
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
                  <div style={{ background: "white", borderRadius: "7.5px", maxWidth: "85%", boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)", overflow: "hidden" }}>
                    {mediaPreview && mediaSample === "Image" && <img src={mediaPreview} alt="preview" style={{ width: "100%", display: "block" }} />}
                    {mediaPreview && mediaSample === "Video" && <video src={mediaPreview} style={{ width: "100%", display: "block", maxHeight: 200 }} controls />}
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
                      {footer && <div style={{ color: "#667781", fontSize: "12px", marginTop: "8px", lineHeight: "16px" }}>{footer}</div>}
                      <div style={{ textAlign: "right", fontSize: "11px", color: "#667781", marginTop: "4px" }}>11:45</div>
                    </div>
                  </div>
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
                setCall={() => {}} // no longer needed, flow handled by useEffect
                setPopUp={setPopup}
                variableData={variableData}
                setVariableData={setVariableData}
                count={getVarCount(bodyText)}
              />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Update;