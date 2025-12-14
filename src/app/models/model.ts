import { FormField } from "@app/shared/forms/config/config";

interface LookupObj {
    value:string;
    label:string
}

interface LookupItem<T,U>{
    value:T;
    label:U;
}

export interface EntityInfo{
    id:string;
    name:string;
    data?:any;
}

interface BaseModel{
    id:string;
    valueDate?:Date;
}

export interface Project extends BaseModel{
    projectName:string;
    capitalInvestment:number;
    startDate:Date;
    endDate:Date;
}

export interface Tracker extends BaseModel{
    itemName:string;
    trackType: TrackType;
    amount:number;
    date:Date;
    project:string;
    projectId:string;
}

export enum TrackType{
    EXPENSE = 'EXPENSE',
    REVENUE = 'REVENUE'
}

export const getLookups = (objs:LookupObj[]) => {
    const lookups:LookupObj[] = [];
    for(const obj of objs){
        const lookup = {} as LookupItem<string, string>;
        lookup.value = obj.value;
        lookup.label = obj.label;
        lookups.push(lookup);
    }
    return lookups;
}

export const trackerFields: FormField[] = [
    {
      name: 'itemName',
      label: 'Item Name',
      type: 'text',
      required: true,
      placeholder: 'Enter item name'
    },
    {
      name: 'trackType',
      label: 'Track Type',
      type: 'select',
      required: true,
      options: getLookups([
        { value: TrackType.EXPENSE, label: 'Expense' },
        { value: TrackType.REVENUE, label: 'Revenue' }
      ])
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter amount'
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    }
  ];

export const projectFields: FormField[] = [
    {
      name: 'projectName',
      label: 'Project Name',
      type: 'text',
      required: true,
      placeholder: 'Enter project name'
    },
    {
      name: 'capitalInvestment',
      label: 'Capital Investment',
      type: 'number',
      required: false,
      placeholder: 'Enter capital investment amount'
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: false,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: false,
    }
  ];
