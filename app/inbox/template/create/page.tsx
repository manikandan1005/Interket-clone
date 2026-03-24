"use client"
import { useEffect, useState } from "react";
// import {   } from "@chakra-ui/react";
import {Typography,Flex,Table,Button, Divider,Card, Tag  } from "antd";


import axios from "axios";
import TemplateBuilder from "../Builder";
import { useRouter } from "next/navigation";
import useAxios from "@/lib/http/useAxios";

const { Title } = Typography;

const Create = () => {
     const router=useRouter();

  const [next, setNext] = useState(false);
  const [templateType, setTemplateType] = useState("default");
  const [Option, setOption] = useState(false);
  const [category, setCategory] = useState<string>("MARKETING");
  const [template, setTemplate] = useState<any>([]);
  const options = [
    { value: "default", label: "Default" },
    { value: "catalogue", label: "Catalogue" },
    { value: "flows", label: "Flows" },
    {
      value: "calling_permission_request",
      label: "Calling Permission Request",
    },
  ];




  return (
    <div style={{ padding: "20px" }}>

       
        <div style={{ border: "1px solid #f0f0f0", padding: "24px", borderRadius: "8px", background: "#fff" }}>
          <Flex justify="space-between">
            <Title level={4}>Set up Your Template</Title>
            <Button className="bg-black! text-white!" 
            onClick={()=>router.back()}
            >
                Back
            </Button>
          </Flex>

          <Title level={4} className="my-8!" > Select Category</Title>
          <Flex gap={10} className="mb-8!" wrap="wrap">
            {["marketing", "utility", "auth"].map((cat) => (
              <Button
                key={cat}
                // type={category === cat ? "primary" : "default"}
                onClick={() => setCategory(cat)}
                style={{ textTransform: 'capitalize' }}
              >
                {cat === 'auth' ? 'Authentication' : cat}
              </Button>
            ))}
          </Flex>

          {/* <Divider>2. Select Template Type</Divider>
          <Flex gap={10} wrap="wrap">
            {options.map((option) => (
              <Button
                key={option.value}
                // type={templateType === option.value ? "primary" : "default"}
                onClick={() => { setTemplateType(option.value), setCategory(option.value) }}
              >
                {option.label}
              </Button>
            ))}
          </Flex> */}

          {/* <div style={{ marginTop: '30px' }}>
            <Button onClick={() => setNext(false)} style={{ marginRight: '10px' }}>
              Back
            </Button>
            <Button  disabled={!category} onClick={() => setOption(true)}>
              Continue
            </Button>
          </div> */}
          {/* {
            Option &&  */}
            <TemplateBuilder category={category} />
          {/* } */}
        </div>
      
      {/* {template.data?.name} */}
      
    </div>
  );
};

export default Create;