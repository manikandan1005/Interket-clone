"use client";
import { Box, Button, Select, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import useAxios from "@/lib/http/useAxios";
import { routes } from "@/lib/routes";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  // country_code: string;
  phone_number: string
  //  role: "admin" | "user";
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    // country_code: ""
    //  role: "admin",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone_number, setPhoneNumber] = useState("");

  const [request] = useAxios<unknown, RegisterPayload>({
    endpoint: "REGISTER",
    showSuccessMsg: true,
    successMsg: "Registration successful. Please sign in.",
  });

  function update<K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      // const register={...form,phone_number:form.country_code + form.phone_number}
      await request({ data: form });
      try {
        window.localStorage.setItem("userName", form.name);
      } catch { }
      router.push(routes.login);
    } catch (err: unknown) {
      let msg = "Registration failed";
      if (typeof err === "object" && err && "data" in err) {
        const d = (err as { data?: unknown }).data;
        if (d && typeof d === "object" && "message" in d) {
          const m = (d as { message?: unknown }).message;
          if (typeof m === "string") msg = m;
        }
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="canvas" px="4">
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="full"
        maxW="420px"
        borderWidth="1px"
        borderRadius="lg"
        bg="panel"
        p="6"
        boxShadow="elevated"
      >
        <VStack align="stretch" gap="4">
          <Box textAlign="center" mb="2">
            <Heading as="h1" size="md" mb="1">
              Create your account
            </Heading>
            <Text fontSize="sm" color="muted">
              Enter your details to sign up.
            </Text>
          </Box>

          {/* <Box>
             <label htmlFor="role">
               <Text fontSize="sm" mb="1" display="block">
                 Role
               </Text>
             </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => update("role", e.target.value as RegisterPayload["role"])}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
           </Box> */}

          {error && (
            <Box
              borderWidth="1px"
              borderRadius="md"
              borderColor="red.300"
              bg="red.50"
              _dark={{ bg: "red.900", borderColor: "red.600" }}
              p="3"
            >
              <Text fontSize="sm" color="red.700" _dark={{ color: "red.100" }}>
                {error}
              </Text>
            </Box>
          )}

          <Box>
            <label htmlFor="name">
              <Text fontSize="sm" mb="1" display="block">
                Name <span className="text-red-600">*</span>
              </Text>
            </label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </Box>

          <Box>
            <label htmlFor="email">
              <Text fontSize="sm" mb="1" display="block">
                Email <span className="text-red-600">*</span>
              </Text>
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="username"
              required
            />
          </Box>
          <Box>
            <label htmlFor="phone">
              <Text fontSize="sm" mb="1" display="block">
                Meta business phone number <span className="text-red-600">*</span>
              </Text>
            </label>
            <Flex gap="5px">
              {/* <select className="border-2 line-clamp-1 border-gray-300 w-20 !text-sm rounded-md px-3 py-2 focus:outline-none "
                id="country_code"
                //placeholder="Select Country Code"
                onChange={(e) => {
                  update("country_code", e.target.value);
                }}
              >
                <option value="91">+91 IND</option>
                <option value="1">+1 USA</option>
                <option value="44">+44 GBR</option>
                <option value="61">+61 AUS</option>
                <option value="65">+65 SGP</option>
                <option value="66">+66 THA</option>
              </select> */}
              <Input
                id="phone"
                placeholder="Example: 1555xxxxxxx"
                maxLength={12}
                value={phone_number}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);;
                  setPhoneNumber(onlyNumbers);
                  update("phone_number", onlyNumbers)
                }}
                autoComplete="PhoneNumber"
                //pattern="[0-9]{12}"
                required
              />
            </Flex>
          </Box>

          <Box>
            <label htmlFor="password">
              <Text fontSize="sm" mb="1" display="block">
                Password <span className="text-red-600">*</span>
              </Text>
            </label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              autoComplete="new-password"
              required
            />
          </Box>

          <Box>
            <label htmlFor="confirm_password">
              <Text fontSize="sm" mb="1" display="block">
                Confirm Password <span className="text-red-600">*</span>
              </Text>
            </label>
            <Input
              id="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={(e) => update("confirm_password", e.target.value)}
              autoComplete="new-password"
              required
            />
          </Box>
          <Button type="submit" colorPalette="brand" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Sign up"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push(routes.login)}>
            Already have an account? Sign in
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
