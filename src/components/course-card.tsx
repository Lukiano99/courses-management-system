import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { BookOpenIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}
const CourseCard = ({
  id,
  price,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            fill
            className="object-cover"
            src={imageUrl}
            alt="Course image"
          />
        </div>
        <div className="flex flex-col p-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-primary md:text-base">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-muted-foreground">
              <Badge variant={"iconSmall"}>
                <BookOpenIcon />
              </Badge>
              <span className="">
                {chaptersLength} {chaptersLength === 1 ? "chapter" : "chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            // <ProgressComponent />
            <div>TODO: Progress component</div>
          ) : (
            <p className="text-base font-medium text-muted-foreground md:text-sm">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
