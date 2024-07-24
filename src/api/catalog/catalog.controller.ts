import { JwtAuthGuard } from "@/common/guard/auth.guard";
import { Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Query, Response, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FindAllCatalogDto } from "@/common/dto/find-all-catalog.dto";
import { PageDto } from "@/common/dto/page.dto";
import { CatalogService } from "@/common/services/catalog.service";
import { AauService } from "@/common/services/aau.service";
import { BbuService } from "@/common/services/bbu.service";
import { RruService } from "@/common/services/rru.service";
import { SoftwareService } from "@/common/services/software.service";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { AauEntity } from "@/common/entity/aau.entity";
import { CatalogEntity } from "@/common/entity/catalog.entity";
import { RruEntity } from "@/common/entity/rru.entity";
import { BbuEntity } from "@/common/entity/bbu.entity";
import { SoftwareEntity } from "@/common/entity/software.entity";
import { Repository } from "typeorm";
import 'multer';
import Responses from "@/common/helper/responses.helper";
import { AntennaService } from "@/common/services/antenna.service";
import { AntennaEntity } from "@/common/entity/antenna.entity";

@Controller('catalog')
@UseGuards(JwtAuthGuard)
export class CatalogController {
    constructor(
        private readonly catalogService: CatalogService,
        private readonly aauService: AauService,
        private readonly bbuService: BbuService,
        private readonly rruService: RruService,
        private readonly softwareService: SoftwareService,
        private readonly antennaService: AntennaService
    ) {}

    @Get()
    private async findAll( @Query() filter: FindAllCatalogDto ) {
        try {
            let data = await this.catalogService.findAll(filter);
            if(data == null) {
                throw new Error("No Data Found");
            }

            return Responses("success", "Ok", data);
        } catch (err) {
            Logger.log("Error encountered: ", err);
            return Responses("failed", err.message, null);
        }
    }
    
    @Get("/column-name")
    private async findColumns( @Query("typeRadio") typeRadio: string) {
        try {
            if (typeRadio == 'aau') {
                return Responses("success", "Ok", await this.aauService.findColumnName());
            } else if (typeRadio == 'rru') {
                return Responses("success", "Ok", await this.rruService.findColumnName());
            } else if (typeRadio == "bbu") {
                return Responses("success", "Ok", await this.bbuService.findColumnName());
            } else if (typeRadio == "software") {
                return Responses("success", "Ok", await this.softwareService.findColumnName());
            } else if (typeRadio == "antenna") {
                return Responses("success", "Ok", await this.antennaService.findColumnName());
            } else {
                return Responses("success", "Ok", {});
            }
        } catch (err) {
            Logger.log("Error encountered: ", err);
            return Responses("failed", err.message, null);
        }
    }

    @Get(':id')
    private async findOne( @Param('id') id: number ): Promise<object> {
        try {
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
            } else if (catalog.typeRadio == "antenna") {
                product = await this.antennaService.findOne(catalog.idDetailProduct);
            }else {
                product = [];
            }

            return Responses("success", "Ok", product);
        } catch (err) {
            Logger.log("Error encountered: ", err);
            return Responses("failed", err.message, null);
        }
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
        try  {
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
                const aau = new AauEntity();
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
                const rru = new RruEntity();
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
                const bbu = new BbuEntity();
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
                const software = new SoftwareEntity();
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
            } else if (body.typeRadio == "antenna") {
                const antenna = new AntennaEntity();
                antenna.vendor = body.vendor;
                antenna.product = body.product;
                antenna.description = body.description;
                antenna.frequencyBand = body.frequencyBand;
                antenna.antennaGain = body.antennaGain;
                antenna.port = body.port;
                antenna.mimo = body.mimo;
                antenna.tilt = body.tilt;
                antenna.beam = body.beam;
                antenna.weight = body.weight;
                antenna.sizes = body.sizes;
                antenna.powerSupply = body.powerSupply;
                antenna.temperature = body.temperature;
                antenna.ga = body.ga;
                antenna.eos = body.eos;
                antenna.imageName = image;
                antenna.documentName = fileFNI;
                antenna.documentTechnicalName = fileTechnical;

                const newAntenna = await this.antennaService.create(antenna);
                id = newAntenna.id;
            }

            const catalog = new CatalogEntity();
            catalog.productName = body.product;
            catalog.vendor = body.vendor;
            catalog.typeRadio = body.typeRadio;
            catalog.idDetailProduct = id;
            catalog.imageName = image;

            await this.catalogService.create(catalog);

            return Responses("success", "Ok", null);
        } catch (err) {
            Logger.log("Error encountered: ", err);
            return Responses("failed", err.message, null);
        }
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
        try {
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

            const catalog = await this.catalogService.findOne(Number(body.id));
            if(catalog == null) {
                throw new NotFoundException("Catalog not found");
            }

            if (body.typeRadio == 'aau') {
                const aau = await this.aauService.findOne(catalog.idDetailProduct);
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

                await this.aauService.update(aau.id, aau);
            } else if (body.typeRadio == 'rru') {
                const rru = await this.rruService.findOne(catalog.idDetailProduct);
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

                await this.rruService.update(rru.id, rru);
            } else if (body.typeRadio == "bbu") {
                const bbu = await this.bbuService.findOne(catalog.idDetailProduct);
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

                await this.bbuService.update(bbu.id,bbu);
            } else if (body.typeRadio == "software") {
                const software = await this.softwareService.findOne(catalog.idDetailProduct);
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

                await this.softwareService.update(software.id,software);
            } else if (body.typeRadio == "antenna") {
                const antenna = await this.antennaService.findOne(catalog.idDetailProduct);
                antenna.vendor = body.vendor;
                antenna.product = body.product;
                antenna.description = body.description;
                antenna.frequencyBand = body.frequencyBand;
                antenna.antennaGain = body.antennaGain;
                antenna.port = body.port;
                antenna.mimo = body.mimo;
                antenna.tilt = body.tilt;
                antenna.beam = body.beam;
                antenna.weight = body.weight;
                antenna.sizes = body.sizes;
                antenna.powerSupply = body.powerSupply;
                antenna.temperature = body.temperature;
                antenna.ga = body.ga;
                antenna.eos = body.eos;
                antenna.imageName = image;
                antenna.documentName = fileFNI;
                antenna.documentTechnicalName = fileTechnical;

                await this.antennaService.update(antenna.id,antenna);
            }

            catalog.productName = body.product;
            catalog.vendor = body.vendor;
            catalog.typeRadio = body.typeRadio;
            catalog.imageName = image;
            await this.catalogService.update(catalog.id, catalog);

            return Responses("success", "Ok", null);
        } catch (err) {
            Logger.log("Error encountered: ", err);
            return Responses("failed", err.message, null);
        }
    }

    @Delete(":id")
    private async delete( @Param('id') id: number ) {
        try {
            const catalog = await this.catalogService.findOne(id);
            
            if (catalog.typeRadio == 'aau') {
                await this.aauService.remove(catalog.idDetailProduct);
            } else if (catalog.typeRadio == 'rru') {
                await this.rruService.remove(catalog.idDetailProduct);
            } else if (catalog.typeRadio == "bbu") {
                await this.bbuService.remove(catalog.idDetailProduct);
            } else if (catalog.typeRadio == "software") {
                await this.softwareService.remove(catalog.idDetailProduct);
            } else if (catalog.typeRadio == "antenna") {
                await this.antennaService.remove(catalog.idDetailProduct);
            }

            await this.catalogService.remove(id);

            return Responses("success", "Ok", null);
        } catch (err) {
            Logger.log("Error encountered: ", err);
            return Responses("failed", err.message, null);
        }
    }
}