import { PrismaClient } from '@prisma/client';
import {} from {};
{
    ResourceName;
}
Repository, FindOptions;
from;
'./{{resourceName}}.repository.interface';
import {} from {};
{
    ResourceName;
}
from;
'../models/{{resourceName}}.model';
export class Prisma {
}
{
    ResourceName;
}
Repository;
implements;
{
    {
        ResourceName;
    }
}
Repository;
{
    constructor(private, prisma, PrismaClient);
    { }
    async;
    findById(id, string);
    Promise < {};
    {
        ResourceName;
    }
}
 | null > {
    const: record = await this.prisma.
};
{
    {
        resourceName;
    }
}
findUnique({
    where: { id }
});
return record ? this.toDomainEntity(record) : null;
async;
findAll(options ?  : FindOptions < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
[] > {
    const: records = await this.prisma.
};
{
    {
        resourceName;
    }
}
findMany({
    where: options?.where,
    orderBy: options?.orderBy,
    take: options?.limit,
    skip: options?.offset,
    include: this.buildInclude(options?.include)
});
return records.map(record => this.toDomainEntity(record));
async;
findOne(criteria, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 | null > {
    const: record = await this.prisma.
};
{
    {
        resourceName;
    }
}
findFirst({
    where: criteria
});
return record ? this.toDomainEntity(record) : null;
async;
create(data, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 > {
    const: record = await this.prisma.
};
{
    {
        resourceName;
    }
}
create({
    data: data
});
return this.toDomainEntity(record);
async;
update(id, string, data, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 | null > {
    try: {
        const: record = await this.prisma.
    }
};
{
    {
        resourceName;
    }
}
update({
    where: { id },
    data: data
});
return this.toDomainEntity(record);
try { }
catch (error) {
    if (error.code === 'P2025') { // Record not found
        return null;
    }
    throw error;
}
async;
delete (id);
string;
Promise < boolean > {
    try: {
        await, this: .prisma.
    }
};
{
    {
        resourceName;
    }
}
delete ({
    where: { id }
});
return true;
try { }
catch (error) {
    if (error.code === 'P2025') { // Record not found
        return false;
    }
    throw error;
}
async;
exists(criteria, Partial < {}, { ResourceName },  > );
Promise < boolean > {
    const: count = await this.prisma.
};
{
    {
        resourceName;
    }
}
count({
    where: criteria
});
return count > 0;
async;
count(criteria ?  : Partial < {}, { ResourceName },  > );
Promise < number > {
    return: this.prisma.
};
{
    {
        resourceName;
    }
}
count({
    where: criteria
});
toDomainEntity(record, any);
{
    {
        ResourceName;
    }
}
{
    // Map Prisma record to domain entity
    return {
        id: record.id,
        // Map all fields from database record to domain entity
        // Handle any data transformations needed
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
    };
    {
        ResourceName;
    }
}
;
buildInclude(include ?  : string[]);
any;
{
    if (!include || include.length === 0) {
        return undefined;
    }
    // Build Prisma include object based on requested relations
    const includeObj = {};
    include.forEach(relation => {
        includeObj[relation] = true;
    });
    return includeObj;
}
//# sourceMappingURL=prisma.js.map