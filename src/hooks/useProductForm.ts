import { useState, useCallback } from "react";
import { FormData, ProductImage, Specification } from "../types/Product";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

export function useProductForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    introductionHtml: "",
    descriptionHtml: "",
    price: "",
    previousPrice: "",
    discountPercent: "",
    category: "",
    images: [],
    specifications: [],
    weight: "",
    meta: {
      title: "",
      description: "",
      keywords: "",
      url: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((fd) => ({ ...fd, [name]: value }));
    },
    []
  );

  const handleImageChange = useCallback(
    (index: number, field: keyof ProductImage, value: string | number) => {
      setFormData((fd) => {
        const images = [...fd.images];
        if (!images[index]) images[index] = { url: "", priority: index + 1 };
        if (field === "url") images[index].url = String(value);
        else images[index].priority = Number(value);
        return { ...fd, images };
      });
    },
    []
  );

  const addImage = useCallback(() => {
    setFormData((fd) => ({
      ...fd,
      images: [...fd.images, { url: "", priority: fd.images.length + 1 }],
    }));
  }, []);

  const removeImage = useCallback((idx: number) => {
    setFormData((fd) => {
      const images = [...fd.images];
      images.splice(idx, 1);
      return { ...fd, images };
    });
  }, []);

  const handleSpecChange = useCallback(
    (index: number, field: keyof Specification, value: string) => {
      setFormData((fd) => {
        const specs = [...fd.specifications];
        if (!specs[index]) specs[index] = { key: "", value: "" };
        specs[index][field] = value;
        return { ...fd, specifications: specs };
      });
    },
    []
  );

  const addSpecification = useCallback(() => {
    setFormData((fd) => ({
      ...fd,
      specifications: [...fd.specifications, { key: "", value: "" }],
    }));
  }, []);

  const removeSpecification = useCallback((idx: number) => {
    setFormData((fd) => {
      const specs = [...fd.specifications];
      specs.splice(idx, 1);
      return { ...fd, specifications: specs };
    });
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((fd) => ({ ...fd, descriptionHtml: value }));
  }, []);

  const handleIntroductionChange = useCallback((value: string) => {
    setFormData((fd) => ({ ...fd, introductionHtml: value }));
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getNextProductId = async (): Promise<number> => {
    const counterDoc = doc(db, "counters", "products");
    const snap = await getDoc(counterDoc);
    if (!snap.exists()) {
      await setDoc(counterDoc, { value: 1 });
      return 1;
    }
    const value = snap.data()?.value || 0;
    await setDoc(counterDoc, { value: value + 1 });
    return value + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Validation
      if (!formData.introductionHtml.trim()) {
        setMessage("Error: Introduction required");
        setLoading(false);
        return;
      }

      if (!formData.descriptionHtml.trim()) {
        setMessage("Error: Description required");
        setLoading(false);
        return;
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setMessage("Error: Invalid price");
        setLoading(false);
        return;
      }

      for (const img of formData.images) {
        if (img.url && !isValidUrl(img.url)) {
          setMessage(`Error: Invalid image URL "${img.url}"`);
          setLoading(false);
          return;
        }
      }

      const productId = await getNextProductId();

      // Prepare data for Firestore
      const productData = {
        ...formData,
        id: productId,
        introductionHtml: formData.introductionHtml || "",
        descriptionHtml: formData.descriptionHtml || "",
        price: parseFloat(formData.price),
        previousPrice: formData.previousPrice ? parseFloat(formData.previousPrice) : null,
        discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : null,
        weight: formData.weight
          ? { value: parseFloat(formData.weight), unit: "kg" }
          : null,
        meta: {
          title: formData.meta.title || "",
          description: formData.meta.description || "",
          keywords: formData.meta.keywords || "",
          url: formData.meta.url || "",
        },
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "products"), productData);

      setMessage("Product added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        introductionHtml: "",
        descriptionHtml: "",
        price: "",
        previousPrice: "",
        discountPercent: "",
        category: "",
        images: [],
        specifications: [],
        weight: "",
        meta: {
          title: "",
          description: "",
          keywords: "",
          url: "",
        },
      });
    } catch (err) {
      console.error(err);
      setMessage("Error: Failed to add product.");
    }

    setLoading(false);
  };

  return {
    formData,
    setFormData,
    loading,
    message,
    handleChange,
    handleImageChange,
    addImage,
    removeImage,
    handleSpecChange,
    addSpecification,
    removeSpecification,
    handleDescriptionChange,
    handleIntroductionChange,
    handleSubmit,
  };
}