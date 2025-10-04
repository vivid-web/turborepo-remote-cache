import { Slot } from "@radix-ui/react-slot";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import * as React from "react";

import * as FieldPrimitive from "@/components/ui/field";

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Field,
		FieldError,
		FieldLabel,
		FormControl,
		FieldContent: FieldPrimitive.FieldContent,
		FieldDescription: FieldPrimitive.FieldDescription,
		FieldLegend: FieldPrimitive.FieldLegend,
		FieldSet: FieldPrimitive.FieldSet,
		FieldTitle: FieldPrimitive.FieldTitle,
	},
	formComponents: {
		FieldSeparator: FieldPrimitive.FieldSeparator,
		FieldGroup: FieldPrimitive.FieldGroup,
	},
});

function Field({
	...props
}: React.ComponentProps<typeof FieldPrimitive.Field>) {
	const { state } = useFieldContext();

	const isInvalid = state.meta.isTouched && !state.meta.isValid;

	return <FieldPrimitive.Field data-invalid={isInvalid} {...props} />;
}

function FieldLabel({
	...props
}: React.ComponentProps<typeof FieldPrimitive.FieldLabel>) {
	const { name } = useFieldContext();

	return <FieldPrimitive.FieldLabel htmlFor={name} {...props} />;
}

function FieldError({
	...props
}: React.ComponentProps<typeof FieldPrimitive.FieldError>) {
	const { state } = useFieldContext();

	const isInvalid = state.meta.isTouched && !state.meta.isValid;

	if (!isInvalid) {
		return null;
	}

	return <FieldPrimitive.FieldError errors={state.meta.errors} {...props} />;
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
	const { state, name } = useFieldContext();

	const isInvalid = state.meta.isTouched && !state.meta.isValid;

	return <Slot id={name} aria-invalid={isInvalid} {...props} />;
}

export { useAppForm, useFieldContext, useFormContext, withForm };
