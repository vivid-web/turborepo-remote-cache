import { invariant } from "@remote-cache/core";
import { Command } from "cmdk";
import {
	CheckSquareIcon,
	ChevronDownIcon,
	SquareIcon,
	XCircleIcon,
	XIcon,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { useClickOutside } from "@/hooks/use-click-outside";

type Value = string;

type Option = {
	label: string;
	value: Value;
};

function MultiSelectItem({
	isSelected,
	children,
	...props
}: React.ComponentProps<typeof CommandItem> & {
	isSelected?: boolean;
}) {
	const Icon = React.useMemo(() => {
		if (isSelected === undefined) return null;

		if (isSelected) return CheckSquareIcon;

		return SquareIcon;
	}, [isSelected]);

	return (
		<CommandItem {...props}>
			{Icon && <Icon className="!h-4 !w-4 font-medium text-foreground" />}
			{children}
		</CommandItem>
	);
}

function includesValues(values: Array<Value>) {
	return (option: Option) => values.includes(option.value);
}

function MultiSelect({
	options,
	value,
	onChange,
	onBlur,
	...props
}: Omit<React.ComponentProps<typeof Command.Input>, "value"> & {
	onChange?: (values: Array<Value>) => void;
	options: Array<Option>;
	value?: Array<Value>;
}) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	const [isOpen, setIsOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [selected, setSelected] = React.useState<Array<Value>>([]);

	const derivedValue = value ?? selected;

	const selectedOptions = options.filter(includesValues(derivedValue));

	const isSelected = (option: Option) => {
		return derivedValue.some((item) => item === option.value);
	};

	const handleClear = () => {
		setSelected([]);
	};

	const handleRemoveLast = () => {
		setSelected((current) => {
			if (!current.length) {
				return current;
			}

			return current.slice(0, -1);
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		invariant(inputRef.current, "Input ref should not be null");

		if (event.key === "Escape") {
			inputRef.current.blur();

			return;
		}

		if (
			(event.key === "Delete" || event.key === "Backspace") &&
			inputRef.current.value === ""
		) {
			handleRemoveLast();
		}
	};

	const handleSelect = (option: Option) => {
		setSelected((current) => [...current, option.value]);
	};

	const handleUnselect = (option: Option) => {
		setSelected((current) => current.filter((item) => item !== option.value));
	};

	const handleToggleSelect = (option: Option) => {
		if (isSelected(option)) {
			handleUnselect(option);

			return;
		}

		handleSelect(option);
	};

	React.useEffect(() => {
		onChange?.(selected);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected]);

	useClickOutside(dropdownRef, () => {
		if (!isOpen) return;

		setIsOpen(false);
		inputRef.current?.blur();
	});

	return (
		<Command
			ref={dropdownRef}
			className="flex flex-col gap-2 overflow-visible bg-transparent"
			onKeyDown={handleKeyDown}
		>
			<div className="group flex max-w-full gap-4 overflow-hidden rounded-md border border-input px-4 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex flex-1 flex-wrap gap-2">
					{selectedOptions.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{selectedOptions.map((value) => (
								<Badge key={value.value} className="flex gap-2">
									{value.label}
									<button
										className="cursor-pointer"
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={() => {
											handleUnselect(value);
										}}
									>
										<XCircleIcon className="!h-4 !w-4" />
									</button>
								</Badge>
							))}
						</div>
					)}
					<Command.Input
						{...props}
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={(...params) => {
							onBlur?.(...params);
							setIsOpen(false);
						}}
						onFocus={() => {
							setIsOpen(true);
						}}
						className="max-w-auto flex min-w-auto flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
					/>
				</div>
				<div className="flex items-center gap-4">
					{derivedValue.length > 0 && (
						<React.Fragment>
							<button
								className="cursor-pointer"
								onClick={(event) => {
									event.stopPropagation();

									handleClear();
								}}
								type="button"
							>
								<XIcon className="!h-4 !w-4 text-muted-foreground" />
							</button>
							<Separator orientation="vertical" className="max-h-6" />
						</React.Fragment>
					)}
					<button
						className="cursor-pointer"
						onClick={(event) => {
							event.stopPropagation();

							setIsOpen(true);
						}}
						type="button"
					>
						<ChevronDownIcon className="!h-4 !w-4 text-muted-foreground" />
					</button>
				</div>
			</div>
			{isOpen && (
				<div className="relative">
					<CommandList>
						<React.Fragment>
							<div className="absolute top-0 z-10 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
								<CommandEmpty>No results found</CommandEmpty>
								<CommandGroup>
									{options.length > 0 &&
										options.map((option) => (
											<MultiSelectItem
												key={option.value}
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												onSelect={() => {
													handleToggleSelect(option);

													setInputValue("");
												}}
												isSelected={isSelected(option)}
												className="cursor-pointer"
											>
												{option.label}
											</MultiSelectItem>
										))}
								</CommandGroup>
							</div>
						</React.Fragment>
					</CommandList>
				</div>
			)}
		</Command>
	);
}

export { MultiSelect };
