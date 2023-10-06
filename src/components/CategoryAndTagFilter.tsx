import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {PiCaretDownBold} from "react-icons/pi";
import {useLocalStorageState} from "@/util/localStorage";

interface FilterMenuProps {
    videos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
}

const SELECTED_TAGS_LOCALSTORAGE_KEY = 'selectedtags'

export default function CategoryAndTagFilter({videos, setFilteredVideos}: FilterMenuProps) {
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
        setFilteredVideos(videos.filter(v => selectedTags.includes(v.tag)))
    }, [selectedTags, setFilteredVideos, videos]);

    return (
        <div className="flex flex-col">
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
            <div className="inline-flex">
                <input
                    type="checkbox"
                    ref={catCheckboxRef}
                    onChange={() => handleCategoryToggle()}
                />
                <div className="inline-flex" onClick={() => setExpanded(!expanded)}>
                    <h2>{category}</h2>
                    <PiCaretDownBold />
                </div>
            </div>
            {expanded &&
            <div>
                {categoriesAndTagsMap.get(category)?.map((tag) => (
                    <div key={tag}>
                        {tag}
                        <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                        />
                    </div>
                ))}
            </div>
            }
        </div>
    )
}