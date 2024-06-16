import React, { useState, useRef } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/slices/productsApiSlice";
import { useSelector } from "react-redux";

const ProductCreatePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = [];

    files.forEach((file) => {
      const reader = new FileReader();
      readers.push(
        new Promise((resolve) => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then((images) => {
      setSelectedImages(images);
    });
  };

  const count = useRef();

  const handleUploadImages = () => {
    if (!count.current.value) {
      return;
    } else if (images.length + selectedImages.length <= 6) {
      setImages([...images, ...selectedImages]);
      count.current.value = null;
    } else {
      toast.error("You can only upload up to 6 images.");
    }
  };

  const handleImageDelete = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const { userInfo } = useSelector((state) => state.auth);
  
  const createProductHandler = async (e) => {
    e.preventDefault();
    try {
      if (images.length == 0) {
        toast.error("Please at least upload one image");
        return;
      }
      await createProduct({
        user: userInfo._id,
        title,
        description,
        category,
        sellPrice,
        salePrice,
        countInStock,
        images,
      });
      toast.success("Product created successfully")
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <main className="p-4 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Product
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-6"
        onSubmit={createProductHandler}
      >
        <div className="flex flex-col gap-4 flex-1">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Description"
              className="input input-bordered"
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4 flex-wrap">
            <div>
              <span>Category:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="mobiles"
                name="category"
                className="w-4 h-4"
                onChange={(e) => setCategory(e.target.id)}
                checked={category === "mobiles"}
              />
              <label htmlFor="mobiles">Mobiles</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="audio"
                name="category"
                className="w-4 h-4"
                onChange={(e) => setCategory(e.target.id)}
                checked={category === "audio"}
              />
              <label htmlFor="audio">Audio</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="computer"
                name="category"
                className="w-4 h-4"
                onChange={(e) => setCategory(e.target.id)}
                checked={category === "computer"}
              />
              <label htmlFor="computer">Computer</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="household"
                name="category"
                className="w-4 h-4"
                onChange={(e) => setCategory(e.target.id)}
                checked={category === "household"}
              />
              <label htmlFor="household">Household</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="kitchen"
                name="category"
                className="w-4 h-4"
                onChange={(e) => setCategory(e.target.id)}
                checked={category === "kitchen"}
              />
              <label htmlFor="kitchen">Kitchen</label>
            </div>
          </div>

          <div className="flex flex-wrap justify-between">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sell Price</span>
              </label>
              <input
                type="number"
                name="sellPrice"
                placeholder="Sell Price"
                className="input input-bordered"
                min="0"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sale Price</span>
              </label>
              <input
                type="number"
                name="salePrice"
                placeholder="Sale Price"
                className="input input-bordered"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">CountInStock</span>
              </label>
              <input
                type="number"
                name="countInStock"
                placeholder="Count In Stock"
                className="input input-bordered"
                min="0"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover image( max: 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              ref={count}
              onChange={handleImgChange}
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleUploadImages}
            >
              Upload
            </button>
          </div>
          <div className="flex flex-wrap gap-6">
            {images &&
              images.map((image, index) => (
                <div key={`images-${index}`} className="relative mb-2">
                  <img
                    src={image}
                    alt={`preview-${index}`}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    onClick={(e) => handleImageDelete(e, index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-lg"
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              ))}
          </div>
          <button className="btn btn-success text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProductCreatePage;
