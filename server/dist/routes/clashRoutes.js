import { Router } from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import prisma from "../config/database.js";
import { clashSchema } from "../validation/clashValidation.js";
import { formatError, imageValidator, removeImage, uploadImage } from "../helper.js";
import { ZodError } from "zod";
import logger from "../config/logger.js";
const router = Router();
router.get("/", authMiddleware, async (req, res) => {
    try {
        const clashs = await prisma.clash.findMany({
            where: { user_id: req.user?.id },
            orderBy: {
                id: "desc",
            },
        });
        return res.json({ message: "Data Fetched", data: clashs });
    }
    catch (error) {
        logger.error({ type: "Clash Post Error", body: error });
        res
            .status(500)
            .json({ error: "Something went wrong.please try again!", data: error });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const clash = await prisma.clash.findUnique({
            where: { id: Number(id) },
            include: {
                ClashItem: {
                    select: {
                        image: true,
                        id: true,
                        count: true,
                    },
                },
                ClashComments: {
                    select: {
                        id: true,
                        comment: true,
                        created_at: true,
                    },
                    orderBy: {
                        id: "desc",
                    },
                },
            },
        });
        return res.json({ message: "Data Fetched", data: clash });
    }
    catch (error) {
        logger.error({ type: "Clash get Error", body: error });
        res
            .status(500)
            .json({ error: "Something went wrong.please try again!", data: error });
    }
});
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const payload = clashSchema.parse(body);
        if (req.files?.image) {
            const image = req.files.image;
            const validMsg = imageValidator(image?.size, image?.mimetype);
            if (validMsg) {
                return res.status(422).json({ errors: { image: validMsg } });
            }
            // * Delete Old Image
            const clash = await prisma.clash.findUnique({
                select: { id: true, image: true },
                where: { id: Number(id) },
            });
            if (clash?.image)
                removeImage(clash?.image);
            payload.image = uploadImage(image);
        }
        await prisma.clash.update({
            data: payload,
            where: { id: Number(id) },
        });
        return res.json({ message: "Clash updated successfully!" });
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errors = formatError(error);
            res.status(422).json({ message: "Invalid data", errors });
        }
        else {
            logger.error({ type: "Clash Post Error", body: error });
            res
                .status(500)
                .json({ error: "Something went wrong.please try again!", data: error });
        }
    }
});
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const clash = await prisma.clash.findUnique({
            select: { image: true, user_id: true },
            where: { id: Number(id) },
        });
        if (!clash) {
            return res.status(404).json({ message: "Clash not found" });
        }
        if (clash.user_id !== req.user?.id) {
            return res.status(401).json({ message: "Un Authorized" });
        }
        if (clash.image)
            removeImage(clash.image);
        const clashItems = await prisma.clashItem.findMany({
            select: {
                image: true,
            },
            where: {
                clash_id: Number(id),
            },
        });
        // * Remove Clash items images
        if (clashItems.length > 0) {
            clashItems.forEach((item) => {
                removeImage(item.image);
            });
        }
        await prisma.clash.delete({
            where: { id: Number(id) },
        });
        return res.json({ message: "Clash Deleted successfully!" });
    }
    catch (error) {
        logger.error({ type: "Clash Error", error });
        return res.status(500).json({ message: "Something went wrong" });
    }
});
// * clash Items routes
router.post("/", authMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const payload = clashSchema.parse(body);
        // * Check if file exists
        if (req.files?.image) {
            const image = req.files.image;
            const validMsg = imageValidator(image?.size, image?.mimetype);
            if (validMsg) {
                return res.status(422).json({ errors: { image: validMsg } });
            }
            payload.image = uploadImage(image);
        }
        else {
            return res
                .status(422)
                .json({ errors: { image: "Image field is required." } });
        }
        await prisma.clash.create({
            data: {
                title: payload.title,
                description: payload?.description,
                image: payload?.image,
                user_id: req.user?.id,
                expire_at: new Date(payload.expire_at),
            },
        });
        return res.json({ message: "Clash created successfully!" });
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errors = formatError(error);
            res.status(422).json({ message: "Invalid data", errors });
        }
        else {
            logger.error({ type: "Clash Post Error", body: error });
            res
                .status(500)
                .json({ error: "Something went wrong.please try again!", data: error });
        }
    }
});
//  To add items
router.post("/items", authMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        const files = req.files;
        let imgErros = [];
        const images = files?.["images[]"];
        if (images.length >= 2) {
            // * Check validation
            images.map((img) => {
                const validMsg = imageValidator(img?.size, img?.mimetype);
                if (validMsg) {
                    imgErros.push(validMsg);
                }
            });
            if (imgErros.length > 0) {
                return res.status(422).json({ errors: imgErros });
            }
            // * Upload images to items
            let uploadedImages = [];
            images.map((img) => {
                uploadedImages.push(uploadImage(img));
            });
            uploadedImages.map(async (item) => {
                await prisma.clashItem.create({
                    data: {
                        image: item,
                        clash_id: Number(id),
                    },
                });
            });
            return res.json({ message: "Clash Items updated successfully!" });
        }
        return res
            .status(404)
            .json({ message: "Please select at least 2 images for clashing." });
    }
    catch (error) {
        logger.error({ type: "Clash Item", body: JSON.stringify(error) });
        return res
            .status(500)
            .json({ message: "Something went wrong.please try again" });
    }
});
export default router;
