import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {PiCaretDownBold} from "react-icons/pi";
import {useLocalStorageState} from "@/util/localStorage";

interface FilterMenuProps {
    videos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
    shuffleVideos(videos: Video[]): Video[]
}

const SELECTED_TAGS_LOCALSTORAGE_KEY = 'selectedtags'

export default function CategoryAndTagFilter({videos, setFilteredVideos, shuffleVideos}: FilterMenuProps) {
    const [selectedTags, setSelectedTags] = useLocalStorageState<string[]>(SELECTED_TAGS_LOCALSTORAGE_KEY, Array.from(new Set(videos.map((v) => v.tag))))

    const categoriesAndTagsMap = useMemo(() => {
        const categories = Array.from(new Set(videos.map((v) => v.category)))
        const catMap = new Map<string, string[]>()
        for (const cat of categories) {
            catMap.set(cat, Array.from(new Set(videos.filter(v => v.category === cat).map((v) => v.tag))))
        }
        return catMap
    }, [videos]);

    useEffect(() => {
        const selectedVideos = videos.filter(v => selectedTags.includes(v.tag))
        setFilteredVideos(shuffleVideos(selectedVideos))
    }, [selectedTags, setFilteredVideos, shuffleVideos, videos]);

    return (
        <div className="flex flex-col space-y-4 w-80">
            <h2 className="text-xl">Categories</h2>
            {Array.from(categoriesAndTagsMap.keys()).map((category) => (
                <Category key={category} category={category} categoriesAndTagsMap={categoriesAndTagsMap} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            ))}
        </div>
    )
}

interface CategoryProps {
    category: string
    categoriesAndTagsMap: Map<string, string[]>
    selectedTags: string[]
    setSelectedTags: Dispatch<SetStateAction<string[]>>
}

function Category({category, categoriesAndTagsMap, selectedTags, setSelectedTags}: CategoryProps) {
    const [expanded, setExpanded] = useState(false)
    const catCheckboxRef = useRef<HTMLInputElement>(null);
    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    const handleCategoryToggle = () => {
        const catTags = categoriesAndTagsMap.get(category) ?? []
        if (catTags.every(t => selectedTags.includes(t))) {
            setSelectedTags(selectedTags.filter((t) => !catTags.includes(t)))
        } else {
            setSelectedTags(Array.from(new Set([...selectedTags, ...catTags])));
        }
    }

    useEffect(() => {
        const catRef = catCheckboxRef.current
        const catTags = categoriesAndTagsMap.get(category) ?? []
        if (catRef) {
            if (catTags.every(t => selectedTags.includes(t))) {
                catRef.checked = true
                catRef.indeterminate = false
                return
            }
            if (catTags.some(t => selectedTags.includes(t))) {
                catRef.checked = false
                catRef.indeterminate = true
                return
            }
            catRef.checked = false
            catRef.indeterminate = false
        }

    }, [categoriesAndTagsMap, category, selectedTags]);

    return (
        <div>
            <div className="flex flex-row w-full">
                <input
                    type="checkbox"
                    ref={catCheckboxRef}
                    onChange={() => handleCategoryToggle()}
                    className="accent-fh-primary"
                />
                <div className="flex flex-row justify-between w-full px-4 cursor-pointer hover:text-fh-primary" onClick={() => setExpanded(!expanded)}>
                    <h2 className="text-ellipsis whitespace-nowrap overflow-hidden">{category}</h2>
                    <PiCaretDownBold className="my-auto" />
                </div>
            </div>
            {expanded &&
            <div className="p-2 space-y-1">
                {categoriesAndTagsMap.get(category)?.map((tag) => (
                    <div key={tag} className="space-x-2 hover:text-fh-primary flex flex-row">
                        <input
                            type="checkbox"
                            id={tag}
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="accent-fh-primary"
                        />
                        <label htmlFor={tag} className="text-ellipsis whitespace-nowrap overflow-hidden">{tag}</label>
                    </div>
                ))}
            </div>
            }
        </div>
    )
}