"use client"
import { Children, useEffect, useState } from "react";

import { Button, Box,Flex } from "@chakra-ui/react";
// const {Div}= {Table} from "@chakra-ui/react";
import { Typography ,Table, Divider, Card, Tag } from "antd";
import { CgTemplate } from "react-icons/cg";

import { useRouter } from "next/navigation";
import DeleteTemplates from "./DeleteList";
import ActiveList from "./ActiveList";
import { Templates } from "@/lib/dummyData";
import { useLogin } from "@/lib/loginStore";

const { Title,Text,Paragraph } = Typography;

const Template = () => {
  const router =useRouter();

  
  const templates = Templates
const setDummyTempId = useLogin((s) => s.setSelectedScreenId);
const [library,setLibrary]=useState<boolean>(true)
const [active,setActive]=useState<boolean>(false)
const [isDelete,setIsDelete]=useState<boolean>(false)
function dummyTemp(i:any){
  console.log("data is ",i)
  setDummyTempId(String(i.id));
  router.push("/inbox/template/update ")
}
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get("http://192.168.1.25:3000/whatsapp/get-temp-status");

  //       console.log(res.data);
  //       setTemplate(res.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }

  //   }
  //   fetchData()
  // }, [])

  return (
    <Flex direction="column" gap="15px" style={{ padding: "20px" }}>
      <Flex justify="space-between">
        <div>
          <Flex gap="10px" >
            <div className="bg-green-700 text-white w-10 h-10 flex items-center justify-center rounded-full">
              <CgTemplate size={20}  />

            </div>
            <Flex direction="column" gap="1px">
              <h1 className="text-2xl font-bold">Templates</h1>
              <p>Managing WhatsApp Templates</p>
            </Flex>
          </Flex>
        </div>
        <Button className="bg-green-800! text-white" 
        onClick={()=>router.push("template/create")}>
          Create New Template
        </Button>
      </Flex>
      <Card >
        <Flex gap="30px">
            <a onClick={()=>{
              setLibrary(true)
              setActive(false)
              setIsDelete(false)
            }} className="w-40 text-black! text-center!">Template Library</a>
            <a onClick={()=>{
              setLibrary(false)
              setActive(true)
              setIsDelete(false)
            }} className="w-40 text-black! text-center!">Active</a>
            <a onClick={()=>{
              setLibrary(false)
              setActive(false)
              setIsDelete(true)
            }} className="w-40 text-black! text-center!">Delete</a>
      
        </Flex>
      </Card>
      <Box >
        {/* <Div.ScrollArea  borderWidth="1px" rounded="md" maxH="560px"> */}
       {library &&
       <div>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6 lg:grid-cols-4 ">
            {
              templates.map(i=>(
                <div className="bg-gray-50! rounded! relative! group w-fit  hover:scale-105  " key={i.id} style={{ padding: 10 }}>
                  <div>
                          {/* HEADER */}
      <div  style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title className="text-xl  uppercase" level={5} style={{ margin: 0 }}>
         {i.category}
        </Title>
        <Text type="secondary">templates</Text>
      </div>

      {/* CARD */}
      <Card
      className="z-10 min-h-60! relative"
        style={{
          borderRadius: 10,
          height:"180px",
          overflow: "hidden",
          padding: 0,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* GREEN CONTENT */}
        <div
          style={{
            background: "#c6e6b4",
            padding: 16,
          }}
          className="min-h-50!"
        >
          <Title level={5} style={{ marginBottom: 10 }}>
            {i.headerText}
          </Title>

          <Paragraph  style={{ marginBottom: 8 }}>
           {i.bodyText}
          </Paragraph>

          <Paragraph style={{ marginBottom: 0 }}>
            👉 Tap below for more details!
          </Paragraph>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "10px 16px",
            background: "#f0f0f0",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <Text>{i.name}</Text>
        </div>
      </Card>
                  </div>
                    <div
  className="absolute inset-0 flex items-center justify-center 
  bg-black/20 opacity-0 group-hover:opacity-100 
  z-20 transition duration-300"
>
   <button className="rounded-3xl! px-5!  bg-white! text-black" onClick={()=>dummyTemp(i)}>Use this temp</button>
  
  </div>
               </div>
              ))
            }
          </div>
        </div>}

       {active &&
<ActiveList/>
        }
        
       {isDelete &&
<DeleteTemplates/>
       }
       {/* </Div.ScrollArea> */}
      </Box>
    </Flex>
  )
}

export default Template;