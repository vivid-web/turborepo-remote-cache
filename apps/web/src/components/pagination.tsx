import { Link } from "@tanstack/react-router";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";

import {
	Pagination as BasePagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
	page: number;
	totalPages: number;
};

function Pagination({ totalPages, page }: Props) {
	const hasPreviousPage = page > 1;
	const hasNextPage = page < totalPages;

	const previousPage = hasPreviousPage ? page - 1 : null;
	const nextPage = hasNextPage ? page + 1 : null;

	const firstPage = previousPage && previousPage > 1 ? 1 : null;
	const lastPage = nextPage && nextPage < totalPages ? totalPages : null;

	const hasLeftEllipsis = firstPage && firstPage + 1 < (previousPage ?? 0);
	const hasRightEllipsis = lastPage && lastPage - 1 > (nextPage ?? 0);

	return (
		<BasePagination>
			<PaginationContent>
				{hasPreviousPage && (
					<PaginationItem>
						<PaginationPrevious asChild>
							<Link to="." search={(search) => ({ ...search, page: page - 1 })}>
								<ChevronLeftIcon />
								<span className="hidden sm:block">Previous</span>
							</Link>
						</PaginationPrevious>
					</PaginationItem>
				)}

				{firstPage && (
					<PaginationItem>
						<PaginationLink asChild>
							<Link
								to="."
								search={(search) => ({ ...search, page: firstPage })}
							>
								{firstPage}
							</Link>
						</PaginationLink>
					</PaginationItem>
				)}

				{hasLeftEllipsis && (
					<PaginationItem>
						<PaginationEllipsis>
							<MoreHorizontalIcon className="size-4" />
							<span className="sr-only">More pages</span>
						</PaginationEllipsis>
					</PaginationItem>
				)}

				{previousPage !== null && (
					<PaginationItem>
						<PaginationLink asChild>
							<Link
								to="."
								search={(search) => ({ ...search, page: previousPage })}
							>
								{previousPage}
							</Link>
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationLink isActive asChild>
						<Link to="." search={(search) => ({ ...search, page })}>
							{page}
						</Link>
					</PaginationLink>
				</PaginationItem>

				{nextPage !== null && (
					<PaginationItem>
						<PaginationLink asChild>
							<Link to="." search={(search) => ({ ...search, page: nextPage })}>
								{nextPage}
							</Link>
						</PaginationLink>
					</PaginationItem>
				)}

				{hasRightEllipsis && (
					<PaginationItem>
						<PaginationEllipsis>
							<MoreHorizontalIcon className="size-4" />
							<span className="sr-only">More pages</span>
						</PaginationEllipsis>
					</PaginationItem>
				)}

				{lastPage !== null && (
					<PaginationItem>
						<PaginationLink asChild>
							<Link to="." search={(search) => ({ ...search, page: lastPage })}>
								{lastPage}
							</Link>
						</PaginationLink>
					</PaginationItem>
				)}

				{hasNextPage && (
					<PaginationItem>
						<PaginationNext asChild>
							<Link to="." search={(search) => ({ ...search, page: page + 1 })}>
								<span className="hidden sm:block">Next</span>
								<ChevronRightIcon />
							</Link>
						</PaginationNext>
					</PaginationItem>
				)}
			</PaginationContent>
		</BasePagination>
	);
}

export { Pagination };
