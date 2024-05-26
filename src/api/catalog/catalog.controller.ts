import { JwtAuthGuard } from "@/common/guard/auth.guard";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FindAllCatalogDto } from "@/shared/dto/find-all-catalog.dto";
import { PageDto } from "@/shared/dto/page.dto";
import { CatalogService } from "./services/catalog.service";
import { AauService } from "./services/aau.service";
import { BbuService } from "./services/bbu.service";
import { RruService } from "./services/rru.service";
import { SoftwareService } from "./services/software.service";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { MstAauEntity } from "@/shared/entity/mst-aau.entity";
import { MstCatalogEntity } from "@/shared/entity/mst-catalog.entity";
import { MstRruEntity } from "@/shared/entity/mst-rru.entity";
import { run } from "node:test";
import { MstBbuEntity } from "@/shared/entity/mst-bbu.entity";
import { MstSoftwareEntity } from "@/shared/entity/mst-software.entity";
import { Repository } from "typeorm";

@Controller('catalog')
@UseGuards(JwtAuthGuard)
export class CatalogController {
    constructor(
        private readonly catalogService: CatalogService,
        private readonly aauService: AauService,
        private readonly bbuService: BbuService,
        private readonly rruService: RruService,
        private readonly softwareService: SoftwareService
    ) {}

    @Get()
    private async findAll( @Query() filter: FindAllCatalogDto ): Promise<PageDto<object>> {
        return await this.catalogService.findAll(filter);
    }
    
    @Get("/column-name")
    private async findColumns( @Query("typeRadio") typeRadio: string) {
        
        if (typeRadio == 'aau') {
            return this.aauService.findColumnName();
        } else if (typeRadio == 'rru') {
            return this.rruService.findColumnName();
        } else if (typeRadio == "bbu") {
            return this.bbuService.findColumnName();
        } else if (typeRadio == "software") {
            return this.softwareService.findColumnName();
        } else {
            return null;
        }
    }

    @Get(':id')
    private async findOne( @Param('id') id: number ): Promise<object> {
        const catalog = await this.catalogService.findOne(id);
        
        let product;
        if (catalog.typeRadio == 'aau') {
            product = await this.aauService.findOne(catalog.idDetailProduct);
        } else if (catalog.typeRadio == 'rru') {
            product = await this.rruService.findOne(catalog.idDetailProduct);
        } else if (catalog.typeRadio == "bbu") {
            product = await this.bbuService.findOne(catalog.idDetailProduct);
        } else if (catalog.typeRadio == "software") {
            product = await this.softwareService.findOne(catalog.idDetailProduct);
        } else {
            product = [];
        }

        return product;
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name : 'fileTechnical', maxCount: 1},
        { name : 'fileFNI', maxCount: 1},
        { name : 'image', maxCount: 1},
    ]))
    private async create( 
        @UploadedFiles() files: {
            fileTechnical: Express.Multer.File[],
            fileFNI: Express.Multer.File[],
            image: Express.Multer.File[]
        },
        @Body() body
    ) {
        const filesDir = 'src/public/files';
        const imageDir = 'src/public/images';

        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir, { recursive: true });
        }
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        const moveFile = async (type: string, file: Express.Multer.File, destDir: string) => {
            const newName = type + Date.now() + '.' + file.mimetype.split('/')[1];
            const destPath = path.join(destDir, newName);
            await fs.promises.writeFile(destPath, file.buffer);
            return newName;
        };

        let fileTechnical;
        let fileFNI;
        let image;
        if (files.fileTechnical && files.fileTechnical[0]) {
            const fileTechnicalPath = await moveFile("technical_doc_", files.fileTechnical[0], filesDir);
            fileTechnical = fileTechnicalPath;
        }
        if (files.fileFNI && files.fileFNI[0]) {
            const fileFNIPath = await moveFile("FNI_doc_", files.fileFNI[0], filesDir);
            fileFNI = fileFNIPath;
        }
        if (files.image && files.image[0]) {
            const imagePath = await moveFile("img_", files.image[0], imageDir);
            image = imagePath;
        }

        let id;
        if (body.typeRadio == 'aau') {
            const aau = new MstAauEntity();
            aau.vendor = body.vendor;
            aau.product = body.product;
            aau.category = body.category;
            aau.description = body.description;
            aau.swRequirement = body.swRequirement;
            aau.type = body.type;
            aau.frequencyBand = body.frequencyBand;
            aau.supportSDR = body.supportSDR;
            aau.ibwMHz = body.ibwMHz;
            aau.mimo = body.mimo;
            aau.paOutputPower = body.paOutputPower;
            aau.powerConsumption = body.powerConsumption;
            aau.weight = body.weight;
            aau.size = body.size;
            aau.ipRating = body.ipRating;
            aau.powerSupply = body.powerSupply;
            aau.cpriPort = body.cpriPort;
            aau.temperature = body.temperature;
            aau.relativeHumidity = body.relativeHumidity;
            aau.recommendedCBRating = body.recommendedCBRating;
            aau.gainAntenna = body.gainAntenna;
            aau.typicalBWTransport = body.typicalBWTransport;
            aau.ga = body.ga;
            aau.eos = body.eos;
            aau.imageName = image;
            aau.documentName = fileFNI;
            aau.documentTechnicalName = fileTechnical;

            const newAau = await this.aauService.create(aau);
            id = newAau.id;
        } else if (body.typeRadio == 'rru') {
            const rru = new MstRruEntity();
            rru.vendor = body.vendor;
            rru.product = body.product;
            rru.category = body.category;
            rru.description = body.description;
            rru.swRequirement = body.swRequirement;
            rru.typeBand = body.typeBand;
            rru.frequencyBand = body.frequencyBand;
            rru.supportSDR = body.supportSDR;
            rru.ibwMHz = body.ibwMHz;
            rru.mimo = body.mimo;
            rru.paOutputPower = body.paOutputPower;
            rru.powerConsumption = body.powerConsumption;
            rru.weight = body.weight;
            rru.dimension = body.dimension;
            rru.ipRating = body.ipRating;
            rru.powerSupply = body.powerSupply;
            rru.cpriPort = body.cpriPort;
            rru.temperature = body.temperature;
            rru.relativeHumidity = body.relativeHumidity;
            rru.recommendedCBRating = body.recommendedCBRating;
            rru.typicalBWTransport = body.typicalBWTransport;
            rru.ga = body.ga;
            rru.eos = body.eos;
            rru.imageName = image;
            rru.documentName = fileFNI;
            rru.documentTechnicalName = fileTechnical;

            const newRru = await this.rruService.create(rru);
            id = newRru.id;
        } else if (body.typeRadio == "bbu") {
            const bbu = new MstBbuEntity();
            bbu.vendor = body.vendor;
            bbu.product = body.product;
            bbu.type = body.type;
            bbu.description = body.description;
            bbu.capacity = body.capacity;
            bbu.port = body.port;
            bbu.chipset = body.chipset;
            bbu.swRequirement = body.swRequirement;
            bbu.powerConsumption = body.powerConsumption;
            bbu.weight = body.weight;
            bbu.size = body.size;
            bbu.temperature = body.temperature;
            bbu.relativeHumidity = body.relativeHumidity;
            bbu.ga = body.ga;
            bbu.eos = body.eos;
            bbu.imageName = image;
            bbu.documentName = fileFNI;
            bbu.documentTechnicalName = fileTechnical;

            const newBbu = await this.bbuService.create(bbu);
            id = newBbu.id;
        } else if (body.typeRadio == "software") {
            const software = new MstSoftwareEntity();
            software.vendor = body.vendor;
            software.product = body.product;
            software.description = body.description;
            software.mainKeyFeatures = body.mainKeyFeatures;
            software.labCertification = body.labCertification;
            software.hardwareNotCompatible = body.hardwareNotCompatible;
            software.numNewFeatures = body.numNewFeatures;
            software.numDeleteFeatures = body.numDeleteFeatures;
            software.numNewCounter = body.numNewCounter;
            software.numDeleteCounter = body.numDeleteCounter;
            software.ga = body.ga;
            software.eos = body.eos;
            software.imageName = image;
            software.documentName = fileFNI;
            software.documentTechnicalName = fileTechnical;

            const newSoftware = await this.softwareService.create(software);
            id = newSoftware.id;
        }

        const catalog = new MstCatalogEntity();
        catalog.productName = body.product;
        catalog.vendor = body.vendor;
        catalog.typeRadio = body.typeRadio;
        catalog.idDetailProduct = id;
        catalog.imageName = image;

        return await this.catalogService.create(catalog);
    }

    @Put()
    @UseInterceptors(FileFieldsInterceptor([
        { name : 'fileTechnical', maxCount: 1},
        { name : 'fileFNI', maxCount: 1},
        { name : 'image', maxCount: 1},
    ]))
    private async update( 
        @UploadedFiles() files: {
            fileTechnical: Express.Multer.File[],
            fileFNI: Express.Multer.File[],
            image: Express.Multer.File[]
        },
        @Body() body
    ){
        const filesDir = 'src/public/files';
        const imageDir = 'src/public/images';

        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir, { recursive: true });
        }
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        const moveFile = async (type: string, file: Express.Multer.File, destDir: string) => {
            const newName = type + Date.now() + '.' + file.mimetype.split('/')[1];
            const destPath = path.join(destDir, newName);
            await fs.promises.writeFile(destPath, file.buffer);
            return newName;
        };

        let fileTechnical;
        let fileFNI;
        let image;
        if (files.fileTechnical && files.fileTechnical[0]) {
            const fileTechnicalPath = await moveFile("technical_doc_", files.fileTechnical[0], filesDir);
            fileTechnical = fileTechnicalPath;
        }
        if (files.fileFNI && files.fileFNI[0]) {
            const fileFNIPath = await moveFile("FNI_doc_", files.fileFNI[0], filesDir);
            fileFNI = fileFNIPath;
        }
        if (files.image && files.image[0]) {
            const imagePath = await moveFile("img_", files.image[0], imageDir);
            image = imagePath;
        }

        if (body.typeRadio == 'aau') {
            const aau = new MstAauEntity();
            aau.vendor = body.vendor;
            aau.product = body.product;
            aau.category = body.category;
            aau.description = body.description;
            aau.swRequirement = body.swRequirement;
            aau.type = body.type;
            aau.frequencyBand = body.frequencyBand;
            aau.supportSDR = body.supportSDR;
            aau.ibwMHz = body.ibwMHz;
            aau.mimo = body.mimo;
            aau.paOutputPower = body.paOutputPower;
            aau.powerConsumption = body.powerConsumption;
            aau.weight = body.weight;
            aau.size = body.size;
            aau.ipRating = body.ipRating;
            aau.powerSupply = body.powerSupply;
            aau.cpriPort = body.cpriPort;
            aau.temperature = body.temperature;
            aau.relativeHumidity = body.relativeHumidity;
            aau.recommendedCBRating = body.recommendedCBRating;
            aau.gainAntenna = body.gainAntenna;
            aau.typicalBWTransport = body.typicalBWTransport;
            aau.ga = body.ga;
            aau.eos = body.eos;
            aau.imageName = image;
            aau.documentName = fileFNI;
            aau.documentTechnicalName = fileTechnical;

            await this.aauService.update(body.id, aau);
        } else if (body.typeRadio == 'rru') {
            const rru = new MstRruEntity();
            rru.vendor = body.vendor;
            rru.product = body.product;
            rru.category = body.category;
            rru.description = body.description;
            rru.swRequirement = body.swRequirement;
            rru.typeBand = body.typeBand;
            rru.frequencyBand = body.frequencyBand;
            rru.supportSDR = body.supportSDR;
            rru.ibwMHz = body.ibwMHz;
            rru.mimo = body.mimo;
            rru.paOutputPower = body.paOutputPower;
            rru.powerConsumption = body.powerConsumption;
            rru.weight = body.weight;
            rru.dimension = body.dimension;
            rru.ipRating = body.ipRating;
            rru.powerSupply = body.powerSupply;
            rru.cpriPort = body.cpriPort;
            rru.temperature = body.temperature;
            rru.relativeHumidity = body.relativeHumidity;
            rru.recommendedCBRating = body.recommendedCBRating;
            rru.typicalBWTransport = body.typicalBWTransport;
            rru.ga = body.ga;
            rru.eos = body.eos;
            rru.imageName = image;
            rru.documentName = fileFNI;
            rru.documentTechnicalName = fileTechnical;

            await this.rruService.update(body.id, rru);
        } else if (body.typeRadio == "bbu") {
            const bbu = new MstBbuEntity();
            bbu.vendor = body.vendor;
            bbu.product = body.product;
            bbu.type = body.type;
            bbu.description = body.description;
            bbu.capacity = body.capacity;
            bbu.port = body.port;
            bbu.chipset = body.chipset;
            bbu.swRequirement = body.swRequirement;
            bbu.powerConsumption = body.powerConsumption;
            bbu.weight = body.weight;
            bbu.size = body.size;
            bbu.temperature = body.temperature;
            bbu.relativeHumidity = body.relativeHumidity;
            bbu.ga = body.ga;
            bbu.eos = body.eos;
            bbu.imageName = image;
            bbu.documentName = fileFNI;
            bbu.documentTechnicalName = fileTechnical;

            await this.bbuService.update(body.id,bbu);
        } else if (body.typeRadio == "software") {
            const software = new MstSoftwareEntity();
            software.vendor = body.vendor;
            software.product = body.product;
            software.description = body.description;
            software.mainKeyFeatures = body.mainKeyFeatures;
            software.labCertification = body.labCertification;
            software.hardwareNotCompatible = body.hardwareNotCompatible;
            software.numNewFeatures = body.numNewFeatures;
            software.numDeleteFeatures = body.numDeleteFeatures;
            software.numNewCounter = body.numNewCounter;
            software.numDeleteCounter = body.numDeleteCounter;
            software.ga = body.ga;
            software.eos = body.eos;
            software.imageName = image;
            software.documentName = fileFNI;
            software.documentTechnicalName = fileTechnical;

            await this.softwareService.update(body.id,software);
        }

        const oldCatalog = await this.catalogService.findOneByIdDetail(body.id);
        const catalog = new MstCatalogEntity();
        catalog.productName = body.product;
        catalog.vendor = body.vendor;
        catalog.typeRadio = body.typeRadio;
        catalog.idDetailProduct = body.id;
        catalog.imageName = image;

        return await this.catalogService.update(oldCatalog.id, catalog);
    }

    @Delete(":id")
    private delete( @Param('id') id: number ): Promise<object> {
        return null;
    }
}