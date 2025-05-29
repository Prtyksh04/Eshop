import { Controller } from "react-hook-form";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const SizeSelector = ({ control, errors }: any) => {
    return (
        <div className="mt-2">
            <label className='block font-semibold text-gray-300 mb-1'>Sizes</label>
            <Controller
                name="sizes"
                control={control}
                render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const isSelected = (field.value || []).includes(size);

                            return (
                                <button
                                    type="button"
                                    key={size}
                                    onClick={() =>
                                        field.onChange(
                                            isSelected
                                                ? field.value.filter((s: string) => s !== size)
                                                : [...(field.value || []), size]
                                        )
                                    }
                                    className={`px-3 py-1 rounded-md border ${isSelected
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-transparent text-gray-300 border-gray-500"
                                        }`}
                                >
                                    {size}
                                </button>
                            )
                        })}
                    </div>
                )}
            />
            {errors.sizes && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.sizes.message}
                </p>
            )}
        </div>
    )
}

export default SizeSelector;

