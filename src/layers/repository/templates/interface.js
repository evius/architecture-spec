import {} from {};
{
    ResourceName;
}
from;
'../models/{{resourceName}}.model';
interface;
{
    {
        ResourceName;
    }
}
Repository;
{
    // Basic CRUD operations
    findById(id, string);
    Promise < {};
    {
        ResourceName;
    }
}
 | null > ;
findAll(options ?  : FindOptions < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
[] > ;
findOne(criteria, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 | null > ;
create(data, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 > ;
update(id, string, data, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 | null > ;
delete (id);
string;
Promise;
// Utility methods
exists(criteria, Partial < {}, { ResourceName },  > );
Promise;
count(criteria ?  : Partial < {}, { ResourceName },  > );
Promise;
// Base repository implementation hints
export class Base {
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
    abstract;
    findById(id, string);
    Promise < {};
    {
        ResourceName;
    }
}
 | null > ;
abstract;
findAll(options ?  : FindOptions < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
[] > ;
abstract;
findOne(criteria, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 | null > ;
abstract;
create(data, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 > ;
abstract;
update(id, string, data, Partial < {}, { ResourceName },  > );
Promise < {};
{
    ResourceName;
}
 | null > ;
abstract;
delete (id);
string;
Promise;
async;
exists(criteria, Partial < {}, { ResourceName },  > );
Promise < boolean > {
    const: result = await this.findOne(criteria),
    return: result !== null
};
abstract;
count(criteria ?  : Partial < {}, { ResourceName },  > );
Promise;
//# sourceMappingURL=interface.js.map