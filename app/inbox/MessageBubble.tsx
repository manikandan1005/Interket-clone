"use client";

import { Box, HStack, Image, Stack,Flex, Text } from "@chakra-ui/react";
import type { Message } from "@/lib/types";
import { formatShortTime } from "@/lib/utils";
import { CheckCheck, Check } from "lucide-react";

export default function MessageBubble(props: { message: Message }) {
  const { message } = props;
  const tempText=message.message
  console.log("Message from box:------------------------- ",tempText)
  const id=message.id
  const isMine = message.sender === "agent";

  return (
    <Stack align={isMine ? "end" : "start"} gap="1">
      <Box
        maxW="78%"
        borderRadius="lg"
        px="3"
        py="2"
        bg={isMine ? "brand.500" : "gray.100"}
        color={isMine ? "white" : "text"}
        _dark={{
          bg: isMine ? "brand.600" : "gray.800",
          color: isMine ? "white" : "gray.50",
        }}
        boxShadow="subtle"
      >
      {/* { message.type === "image" && message.fileUrl ? (
          <Stack gap="2">
            <Image
              src={message.fileUrl}
              alt={message.text ?? "Image message"}
              borderRadius="md"
              maxH="240px"
              objectFit="cover"
            />
            {message.text && <Text fontSize="sm">{message.text}</Text>}
          </Stack>
        )}: 
        // message.type === "audio" ? (
        //   <Stack gap="1">
        //     <Text fontSize="sm" fontWeight="600">
        //       {message.fileName ?? "File"}
        //     </Text>
        //     {message.text && <Text fontSize="sm">{message.text}</Text>}
        //   </Stack>
        // )
      {  message.type === "audio" ? (
  <Stack gap="1">
    <Text fontSize="sm" fontWeight="600">
      Audio
    </Text>

    <audio controls>
      <source src={message.fileUrl} type="audio/ogg" />
      Your browser does not support the audio element.
    </audio>
  </Stack>
)}:
        {message.type === "video" && (
  <video controls className="w-60 rounded">
    <source src={message.fileUrl} type="video/mp4" />
  </video>
)}
:
{message.type === "document" && (
  <a
    href={message.fileUrl}
    target="_blank"
    className="text-blue-600 underline"
  >
    Open Document
  </a>
)}
:
{message.type === "sticker" && (
  <img
    src={message.fileUrl}
    alt="sticker"
    className="w-24 h-24 object-contain"
  />
)}:
        
        (
          <Text fontSize="sm" whiteSpace="pre-wrap">
            {message.text}
          </Text>
        ) */}
{
message.type === "image" && message.fileUrl ? (
  <Stack gap="2">
    <Image
      src={message.fileUrl}
      alt={message.text ?? "Image message"}
      borderRadius="md"
      maxH="240px"
      objectFit="cover"
    />
    {message.text && <Text fontSize="sm">{message.text}</Text>}
  </Stack>
) : message.type === "audio" ? (
  <Stack gap="1">
    <Text fontSize="sm" fontWeight="600">Audio</Text>
    <audio controls>
      <source src={message.fileUrl} type="audio/ogg" />
    </audio>
  </Stack>
) : message.type === "video" ? (
  <video controls className="w-60 rounded">
    <source src={message.fileUrl} type="video/mp4" />
  </video>
) : message.type === "document" ? (
  <a href={message.fileUrl} target="_blank" className="text-blue-600 underline">
    Open Document
  </a>
) : message.type === "sticker" ? (
  <img src={message.fileUrl} alt="sticker" className="w-24 h-24 object-contain" />
) 
            : message.type === "template" ? (
              <Stack gap="2" minW="200px">
                {tempText?.headerHandle && (
                  <Image
                    src={tempText.headerHandle}
                    alt="Template Header"
                    borderRadius="md"
                    maxH="160px"
                    objectFit="cover"
                  />
                )}
                <Text className=" text-white!" fontSize="sm" whiteSpace="pre-wrap" color={isMine ? "white" : "text"}>
                  {tempText?.content || tempText?.content || (typeof tempText === 'string' ? tempText : "")}
                </Text>
                <Text className="  text-white!" fontSize="sm" whiteSpace="pre-wrap" color={isMine ? "white" : "text"}>
                  {tempText?.footer || tempText?.footer || (typeof tempText === 'string' ? tempText : "")}
                </Text>
                <Box>
                  {tempText?.buttons.map((i:any)=>(
                    <Flex w="full" alignItems="center" justifyContent="center" className="text-center rounded bg-gray-50 text-black!">
                      <a className="w-full h-full" href={i.value}>{i.text}</a>
                    </Flex>
                  ))}
                </Box>
              </Stack>
            )
:
 (
  <Text fontSize="sm" whiteSpace="pre-wrap">
    {message.text}
  </Text>
)
}
      </Box>

      <HStack gap="1" color="muted">
        <Text fontSize="xs">{formatShortTime(message.time)}</Text>
        {isMine && (
          <Box aria-label={message.status ?? "sent"}>
            {message.status === "read" ? (
              <CheckCheck size={14} />
            ) : message.status === "delivered" ? (
              <CheckCheck size={14} />
            ) : (
              <Check size={14} />
            )}
          </Box>
        )}
      </HStack>
    </Stack>
  );
}

