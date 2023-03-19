import {FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {Field, useField} from "formik";

export const TextField = ({label, ...props}) => {
    const [field, meta] = useField(props)
    return (
        <>
            <FormControl isInvalid={meta.touched && meta.error}>
                <FormLabel fontSize={"lg"}>{label}</FormLabel>
                <Input
                    as={Field}
                    {...field}
                    {...props}
                />
                <FormErrorMessage>{meta.error}</FormErrorMessage>
            </FormControl>
        </>
    );
};