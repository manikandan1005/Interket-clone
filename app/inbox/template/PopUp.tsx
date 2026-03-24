"use client"
import React, { useState } from 'react'
import { Flex, Box, Button, Input, Text } from '@chakra-ui/react'

interface Props {
    popup: boolean
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>
    variableData: any
    setCall: React.Dispatch<React.SetStateAction<boolean>>,
    setVariableData: React.Dispatch<React.SetStateAction<any>>
    count: number,
}

export default function PopUp({ setPopUp, popup, setCall, setVariableData, variableData, count }: Props) {

    const [fields, setFields] = useState<Record<number, string>>(() =>
        Object.fromEntries(Array.from({ length: count }, (_, i) => [i + 1, ""]))
    )

    const handleChange = (key: number, value: string) => {
        setFields(prev => ({ ...prev, [key]: value }))
    }

    const handleDone = () => {
        console.log('Submitted:', fields)
        setVariableData(fields)  // ✅ save variable sample data to parent
        setPopUp(false)          // ✅ close popup
        setCall(true)            // ✅ trigger useEffect in TemplateBuilder → fires API
    }

    const handleClose = () => {
        setPopUp(false);
    }

    return (
        <Box
            position="fixed"
            inset={0}
            bg="blackAlpha.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
        >
            <Box
                bg="white"
                borderRadius="xl"
                w="full"
                maxW="680px"
                mx={4}
                overflow="hidden"
                boxShadow="2xl"
            >
                {/* Header */}
                <Flex
                    px={6}
                    py={4}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                        Add Sample Content (English)
                    </Text>
                    <Box
                        as="button"
                        onClick={handleClose}
                        w={8}
                        h={8}
                        borderRadius="full"
                        border="1.5px solid"
                        borderColor="gray.400"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.500"
                        cursor="pointer"
                        _hover={{ borderColor: 'gray.600', color: 'gray.700' }}
                        fontSize="16px"
                        fontWeight="bold"
                        lineHeight={1}
                    >
                        ✕
                    </Box>
                </Flex>

                {/* Body */}
                <Box px={6} pt={5} pb={6}>
                    <Text fontSize="sm" color="gray.600" mb={6} lineHeight="1.6">
                        To help WhatsApp understand what kind of message you want to send, you have the option
                        to provide specific examples of the variables in your templates by adding samples for
                        them here. In case you have a media header in your template, you can also provide a
                        sample file for the media header.
                    </Text>

                    <Text fontSize="md" fontWeight="semibold" color="gray.800" mb={4}>
                        Body
                    </Text>

                    <div className="grid grid-cols-2 gap-4 max-h-70! overflow-y-scroll!">
                        {Object.entries(fields).map(([key, value]) => {
                            const numKey = Number(key)
                            return (
                                <Box key={numKey}>
                                    <Text fontSize="sm" color="gray.700" mb={1}>
                                        {`{{${numKey}}}`}
                                    </Text>
                                    <Input
                                        value={value}
                                        onChange={e => handleChange(numKey, e.target.value)}
                                        placeholder={`Enter content for {{${numKey}}}`}
                                        size="md"
                                        borderRadius="md"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #63b3ed' }}
                                        _placeholder={{ color: 'gray.400' }}
                                        fontSize="sm"
                                    />
                                </Box>
                            )
                        })}
                    </div>
                </Box>

                {/* Footer */}
                <Box px={6} py={4} borderTop="1px solid" borderColor="gray.200">
                    <Button
                        w="full"
                        onClick={handleDone}
                        bg="gray.400"
                        color="white"
                        size="lg"
                        borderRadius="md"
                        _hover={{ bg: 'gray.500' }}
                        _active={{ bg: 'gray.600' }}
                        fontWeight="semibold"
                        fontSize="md"
                    >
                        Done
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}