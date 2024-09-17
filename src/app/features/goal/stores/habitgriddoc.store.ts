import { computed, inject } from '@angular/core';
import { concatMap, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HabitGridService } from '../services/habitgrid.service';
import { HabitGriddoc } from '../models/habitgriddoc';
import { HabitGrid } from '../models/habitgrid';

type HabitGridState = {
    id: number,
    habitgrid: Array<HabitGrid>;
    habitgriddoc: Array<HabitGriddoc>;
    isLoading: boolean;
};

const initialState: HabitGridState = {
    id: 0,
    habitgrid: new Array<HabitGrid>,
    habitgriddoc: new Array<HabitGriddoc>(),
    isLoading: false,
};

export const HabitGriddocStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ habitgrid }) => ({
        habitgridsCount: computed(() => habitgrid().length),
        habitgridsList: computed(() => habitgrid())
    })),
    withMethods((store, habitgridService = inject(HabitGridService)) => ({
        setHabitGriddocId(habitgridid: number): void {
            patchState(store, { id: habitgridid });
        },
        getHabitGrid: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() => {
                    return habitgridService.getHabitGrid().pipe(
                        tapResponse({
                            next: (habitgriddoc: Array<HabitGriddoc>) => {
                                patchState(store, { habitgriddoc })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),

        addHabitGriddoc: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((habitgrid: HabitGriddoc) => {
                    return habitgridService.postHabitGriddoc(habitgrid).pipe(
                        tapResponse({
                            next: (res: HabitGriddoc) => {
                                store.habitgriddoc().push(res)
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),

        saveHabitGriddoc: rxMethod<HabitGriddoc>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((habitgrid: HabitGriddoc) => {
                    return habitgridService.putHabitGriddoc(habitgrid).pipe(
                        tapResponse({
                            next: (res: HabitGriddoc) => {
                                // replace updated habitgrid
                                // patchState(store, (state: any) => ({ habitgriddoc: state.habitgriddoc.splice(state.habitgriddoc.findIndex((item: HabitGriddoc) => habitgrid.id == item.id), 1, habitgrid) }))
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        )
        // deleteHabitGriddoc: rxMethod<number>(
        //     pipe(
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((id) => {
        //             return habitgridService.deleteHabitGriddoc(id).pipe(
        //                 tapResponse({
        //                     next: (res: any) => {
        //                         // remove deleted from store
        //                         patchState(store, (state: any) => ({ habitgrids: state.habitgrids.filter((habitgrid: HabitGriddoc) => habitgrid.id !== id) }))
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // )
    }))
);