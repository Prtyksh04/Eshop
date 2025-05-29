import { useState } from "react";
import { Controller } from "react-hook-form";
import { Plus } from "lucide-react";

const defaultColors = [
    "#000000", // Black
    "#ffffff", // White
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
];


const ColorSelector = ({ control, errors }: any) => {
    const [customColors, setCustomColors] = useState<string[]>([])
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [newColor, setNewColor] = useState("#ffffff")
    return (
        <div className="mt-2">
            <label className="block font-semibold text-gray-300 mb-1">Colors</label>
            <Controller
                name="colors"
                control={control}
                render={({ field }) => (
                    <div className="flex gap-3 flex-wrap">
                        {[...defaultColors, ...customColors].map((color) => {
                            const isSelected = (field.value || []).includes(color);
                            const isLightColor = ["#ffffff", "#ffff00"].includes(color);
                            return (
                                <button
                                    type="button"
                                    key={color}
                                    onClick={() => field.onChange(isSelected
                                        ? field.value.filter((c: string) => c !== color)
                                        : [...(field.value || []), color])}
                                    className={`w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition ${isSelected ? "scale-110 border-white" : "border-transparent"} ${isLightColor ? "bg-gray-600" : ""}`}
                                    style={{ backgroundColor: color }}
                                />
                            )
                        })}
                        {/* Add new Color */}
                        <button type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            <Plus size={16} color="white" />
                        </button>
                        {/*  Color Picker */}
                        {showColorPicker && (
                            <div className="relative flex items-center gap-2">
                                <input type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-10 h-10 p-0 border-none cursor-pointer"
                                />
                                <button type="button"
                                    className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
                                    onClick={() => {
                                        setCustomColors([...customColors, newColor])
                                        setShowColorPicker(false);
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    )
}

export default ColorSelector;